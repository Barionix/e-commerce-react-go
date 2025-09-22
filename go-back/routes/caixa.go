package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/go-pg/pg/v10"

	"e_commerece_react_go/controllers"
)

func RegisterCaixaRoutes(r *gin.Engine, db *pg.DB) {
	caixaGroup := r.Group("/caixa")
	{
		caixaGroup.POST("/cadastrarMovimentacao", func(c *gin.Context) {
			controllers.CadastrarMovimentacao(c, db)
		})

		caixaGroup.GET("/listarMovimentacoes", func(c *gin.Context) {
			controllers.ListarMovimentacoes(c, db)
		})

		caixaGroup.GET("/obterCaixa", func(c *gin.Context) {
			controllers.ObterCaixa(c, db)
		})

		caixaGroup.DELETE("/:id/deletarMovimentacao", func(c *gin.Context) {
			controllers.DeletarMovimentacao(c, db)
		})
	}
}
