package controllers

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-pg/pg/v10"

	"e_commerece_react_go/models"
)

func CadastrarMovimentacao(c *gin.Context, db *pg.DB) {
	var input struct {
		Tipo      string  `json:"tipo" binding:"required"`
		Nome      string  `json:"nome" binding:"required"`
		Descricao string  `json:"descricao" binding:"required"`
		Valor     float64 `json:"valor" binding:"required"`
	}

	// Agora usa JSON
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Preencha todos os campos obrigatórios", "details": err.Error()})
		return
	}

	mov := &models.Movimentacao{
		Tipo:      input.Tipo,
		Nome:      input.Nome,
		Descricao: input.Descricao,
		Valor:     input.Valor,
		Data:      time.Now(),
	}

	// Salva movimentação
	if _, err := db.Model(mov).Insert(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao salvar movimentação"})
		return
	}

	// Busca ou cria o caixa
	caixa := &models.Caixa{}
	err := db.Model(caixa).First()
	if err != nil && err != pg.ErrNoRows {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar caixa"})
		return
	}
	if err == pg.ErrNoRows {
		caixa.SaldoTotal = 0
		caixa.SaldoEstimado = 0
	}

	// Atualiza saldo
	if input.Tipo == "entrada" {
		caixa.SaldoTotal += input.Valor
		caixa.SaldoEstimado += input.Valor
	} else {
		caixa.SaldoTotal -= input.Valor
		caixa.SaldoEstimado -= input.Valor
	}

	// Salva caixa atualizado
	if _, err := db.Model(caixa).WherePK().OnConflict("(id) DO UPDATE").Insert(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar caixa"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":      "Movimentação cadastrada e caixa atualizado com sucesso",
		"movimentacao": mov,
		"caixa":        caixa,
	})
}

func ListarMovimentacoes(c *gin.Context, db *pg.DB) {
	var movimentacoes []models.Movimentacao
	err := db.Model(&movimentacoes).Order("data DESC").Select()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao listar movimentações"})
		return
	}
	c.JSON(http.StatusOK, movimentacoes)
}

// Obter saldo do caixa
func ObterCaixa(c *gin.Context, db *pg.DB) {
	caixa := &models.Caixa{}
	err := db.Model(caixa).Where("id = ?", 1).Select()
	if err != nil {
		caixa = &models.Caixa{ID: 1, SaldoTotal: 0, SaldoEstimado: 0}
		_, _ = db.Model(caixa).Insert()
	}
	c.JSON(http.StatusOK, caixa)
}

// Deletar movimentação e atualizar caixa
func DeletarMovimentacao(c *gin.Context, db *pg.DB) {
	id := c.Param("id")

	movimentacao := &models.Movimentacao{}
	if err := db.Model(movimentacao).Where("id = ?", id).Select(); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Movimentação não encontrada"})
		return
	}

	err := db.RunInTransaction(context.Background(), func(tx *pg.Tx) error {
		caixa := &models.Caixa{}
		if err := tx.Model(caixa).Where("id = ?", 1).Select(); err != nil {
			return fmt.Errorf("caixa não encontrado: %w", err)
		}

		if movimentacao.Tipo == "entrada" {
			caixa.SaldoTotal -= movimentacao.Valor
			caixa.SaldoEstimado -= movimentacao.Valor
		} else {
			caixa.SaldoTotal += movimentacao.Valor
			caixa.SaldoEstimado += movimentacao.Valor
		}

		if _, err := tx.Model(caixa).WherePK().Update(); err != nil {
			return err
		}

		if _, err := tx.Model(movimentacao).Where("id = ?", id).Delete(); err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao deletar movimentação"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Movimentação deletada e caixa atualizado"})
}
