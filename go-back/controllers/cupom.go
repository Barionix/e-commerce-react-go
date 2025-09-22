package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-pg/pg/v10"

	"e_commerece_react_go/models"
)

func CadastrarCupom(c *gin.Context, db *pg.DB) {
	var input struct {
		Code     string `json:"code" pg:",notnull"` // required
		Autor    string `json:"autor"`              // opcional
		Desconto string `json:"desconto" pg:",notnull"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	descontoFloat, err := strconv.ParseFloat(input.Desconto, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Preço inválido"})
		return
	}

	cupom := models.Cupom{
		Code:     input.Code,
		Autor:    input.Autor,
		Desconto: descontoFloat,
	}

	_, err = db.Model(&cupom).Insert()
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusForbidden, gin.H{"error": "Erro ao publicar carrinho"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"code": cupom})
}

func ListarCupons(c *gin.Context, db *pg.DB) {
	var cupons []models.Cupom
	err := db.Model(&cupons).Select()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, cupons)
}
