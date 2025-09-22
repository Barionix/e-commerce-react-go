package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/go-pg/pg/v10"

    "e_commerece_react_go/controllers"
)

func RegisterShartRoutes(r *gin.Engine, db *pg.DB) {
    shartGroup := r.Group("/sharts")
    {
        shartGroup.POST("/publishChart", func(c *gin.Context) {
            controllers.PublishChart(c, db)
        })

        shartGroup.POST("/confirmSale", func(c *gin.Context) {
            controllers.ConfirmSale(c, db)
        })
        shartGroup.GET("/:id/getChartByID", func(c *gin.Context) {
            controllers.GetChartByID(c, db)
        })

    }
}
