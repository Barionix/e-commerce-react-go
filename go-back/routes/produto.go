package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/go-pg/pg/v10"

    "e_commerece_react_go/controllers"
)

func RegisterProdutoRoutes(r *gin.Engine, db *pg.DB) {
    produtoGroup := r.Group("/produtos")
    {
        produtoGroup.GET("/listarProdutos", func(c *gin.Context) {
            controllers.ListarProdutos(c, db)
        })
        produtoGroup.GET("/:id/getProductByID", func(c *gin.Context) {
            controllers.GetProductByID(c, db)
        })
        produtoGroup.POST("/cadastrarProduto", func(c *gin.Context) {
            controllers.CadastrarProduto(c, db)
        })
        produtoGroup.POST("/:id/editarProduto", func(c *gin.Context) {
            controllers.EditarProduto(c, db)
        })
    }
}
