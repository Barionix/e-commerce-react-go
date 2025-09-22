package routes

import (
	"net/http"
	"time"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/go-pg/pg/v10"
	"github.com/golang-jwt/jwt/v4"

	"e_commerece_react_go/models"
)

var jwtSecret = []byte("chave_super_secreta") // 👈 troque por algo seguro

func RegisterAuthRoutes(r *gin.Engine, db *pg.DB) {
	auth := r.Group("/auth")

	// Rota de login
	auth.POST("/login", func(c *gin.Context) {
		var loginData struct {
			Email    string `json:"email" binding:"required"`
			Password string `json:"password" binding:"required"`
		}

		if err := c.ShouldBindJSON(&loginData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Email e senha obrigatórios"})
			return
		}

		// Verifica usuário no banco
		var usuario models.Usuario
		err := db.Model(&usuario).
			Where("email = ? AND password = ?", loginData.Email, loginData.Password).
			First()
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Credenciais inválidas"})
			return
		}

		// Gera JWT
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"user_id": usuario.ID,
			"email":   usuario.Email,
			"exp":     time.Now().Add(time.Hour * 1).Unix(), // expira em 1h
		})

		tokenString, err := token.SignedString(jwtSecret)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao gerar token"})
			return
		}

		// Retorna usuário (sem senha) + token
		usuario.Password = ""
		c.JSON(http.StatusOK, gin.H{
			"auth": true,
			"token": tokenString,
			"user": usuario,
		})
	})

	r.POST("/usuarios/cadastrarUsuario", func(c *gin.Context) {
		var usuario models.Usuario

		if err := c.ShouldBindJSON(&usuario); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		_, err := db.Model(&usuario).Insert()
		if err != nil {
			fmt.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao cadastrar usuário"})
			return
		}

		usuario.Password = "" 
		c.JSON(http.StatusCreated, usuario)
	})
}
