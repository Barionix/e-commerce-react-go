package controllers

import (
    "net/http"
	"strconv"
	"fmt"
	"context"
	"encoding/json"
    "github.com/gin-gonic/gin"
    "github.com/go-pg/pg/v10"

    "e_commerece_react_go/models"
    "e_commerece_react_go/utils"
)


func PublishChart(c *gin.Context, db *pg.DB) {
	var input struct {
		Chart string  `json:"chart"`
		Preco string `json:"preco"`
		Nome  string  `json:"nome,omitempty"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	precoFloat, err := strconv.ParseFloat(input.Preco, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Preço inválido"})
		return
	}

	code := utils.GeraCodigoAleatorio()

	chart := models.Chart{
		Code:      code,
		ChartJSON: input.Chart,
		Preco:     precoFloat,
		Nome:      input.Nome,
	}

	_, err = db.Model(&chart).Insert()
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusForbidden, gin.H{"error": "Erro ao publicar carrinho"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"code": chart.Code})
}

func GetChartByID(c *gin.Context, db *pg.DB) {
	id := c.Param("id")
	chart := &models.Chart{}
	err := db.Model(chart).Where("code = ?", id).Select()
	if err != nil {
        c.JSON(http.StatusNotFound, gin.H{
            "message": "Chart não encontrado",
            "error":   err.Error(),
        })
        return
    }

	c.JSON(http.StatusOK, chart)
}

type ConfirmSaleInput struct {
    Code       string `form:"code" binding:"required"`
    Chart      string `form:"chart" binding:"required"`
    Preco      string `form:"preco" binding:"required"`
    Nome       string `form:"nome"` // pode ser vazio
    Status     string `form:"status" binding:"required"`
    ValorFinal string `form:"valorFinal" binding:"required"`
}

func ConfirmSale(c *gin.Context, db *pg.DB) {
    var input ConfirmSaleInput
    if err := c.ShouldBind(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Preencha todos os campos obrigatórios"})
        return
    }

    // Parse dos preços (strings -> float64)
    preco, err := strconv.ParseFloat(input.Preco, 64)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Preço inválido"})
        return
    }

    valorFinal, err := strconv.ParseFloat(input.ValorFinal, 64)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Valor final inválido"})
        return
    }

    // Parse do campo Chart (JSON dentro de string)
    var products []map[string]interface{}
    if err := json.Unmarshal([]byte(input.Chart), &products); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Formato inválido de 'chart' (esperado JSON)"})
        return
    }

    sale := &models.Sales{
        Code:       input.Code,
        Chart:      input.Chart,
        Preco:      preco,
        Nome:       input.Nome,
        Status:     input.Status,
        ValorFinal: valorFinal,
    }

    err = db.RunInTransaction(context.Background(), func(tx *pg.Tx) error {
        for _, p := range products {
            rawID, ok := p["id"]
            if !ok {
                return fmt.Errorf("produto sem campo id")
            }

            idVal := fmt.Sprintf("%v", rawID) // converte para string

            if _, err := tx.Model(&models.Produto{}).
                Set("estoque = estoque - ?", 1).
                Where("id = ?", idVal).
                Update(); err != nil {
                return fmt.Errorf("erro ao atualizar estoque do produto %v: %w", idVal, err)
            }
        }

        if _, err := tx.Model(sale).Insert(); err != nil {
            return fmt.Errorf("erro ao inserir venda: %w", err)
        }

        return nil
    })

    if err != nil {
        fmt.Println("Erro ao confirmar venda:", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao confirmar compra"})
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "message": "Compra confirmada com sucesso!",
        "sale":    sale,
    })
}
