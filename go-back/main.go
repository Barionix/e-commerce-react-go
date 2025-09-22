package main

import (
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"

	"e_commerece_react_go/models"
	"e_commerece_react_go/routes"
)

func connectDB() *pg.DB {
	db := pg.Connect(&pg.Options{
		Addr:     "localhost:5432", // 👈 nome do serviço do docker-compose
		User:     "postgres",
		Password: "postgres",
		Database: "ecommerce",
	})

	// Testa conexão
	var n int
	_, err := db.QueryOne(pg.Scan(&n), "SELECT 1")
	if err != nil {
		log.Fatalf("Erro ao conectar no banco: %v", err)
	}

	return db
}

func createSchema(db *pg.DB) {
	modelsList := []interface{}{
		(*models.Produto)(nil),
		(*models.Chart)(nil),
		(*models.Usuario)(nil),
		(*models.Sales)(nil),
		(*models.Cupom)(nil),
		(*models.Caixa)(nil),
		(*models.Movimentacao)(nil),
	}

	for _, model := range modelsList {
		err := db.Model(model).CreateTable(&orm.CreateTableOptions{
			IfNotExists: true,
		})
		if err != nil {
			log.Fatal(err)
		}
	}
}

func main() {
	db := connectDB()
	defer db.Close()

	createSchema(db)

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // frontend React
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	r.Static("/uploads", "./uploads")

	routes.RegisterProdutoRoutes(r, db)
	routes.RegisterAuthRoutes(r, db)
	routes.RegisterShartRoutes(r, db)
	routes.RegisterCupomRoutes(r, db)
	routes.RegisterCaixaRoutes(r, db)
	log.Fatal(r.Run(":8080"))
}
