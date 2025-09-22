package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/go-pg/pg/v10"

	"e_commerece_react_go/controllers"
)

func RegisterCupomRoutes(r *gin.Engine, db *pg.DB) {
	cupomGroup := r.Group("/cupons")
	{
		cupomGroup.POST("/cadastrarCupom", func(c *gin.Context) {
			controllers.CadastrarCupom(c, db)
		})

		cupomGroup.GET("/listarCupons", func(c *gin.Context) {
			controllers.ListarCupons(c, db)
		})

	}
}
