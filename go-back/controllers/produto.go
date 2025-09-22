package controllers

import (
    "fmt"
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/go-pg/pg/v10"

    "e_commerece_react_go/models"
)


func ListarProdutos(c *gin.Context, db *pg.DB) {
    var produtos []models.Produto
    err := db.Model(&produtos).Select()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    for i, p := range produtos {
        for j, img := range p.Img {
            produtos[i].Img[j] = "http://" + c.Request.Host + "/" + img
        }
    }

    c.JSON(http.StatusOK, produtos)
}


func GetProductByID(c *gin.Context, db *pg.DB) {
    id := c.Param("id") 
    produto := &models.Produto{}
    err := db.Model(produto).Where("id = ?", id).Select()
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{
            "message": "Produto não encontrado",
            "error":   err.Error(),
        })
        return
    }

    c.JSON(http.StatusOK, produto)
}

func CadastrarProduto(c *gin.Context, db *pg.DB) {
    var produto models.Produto

    produto.Nome = c.PostForm("nome")
    produto.Descricao = c.PostForm("descricao")

    if preco := c.PostForm("preco"); preco != "" {
        fmt.Sscanf(preco, "%f", &produto.Preco)
    }
    if precoDesconto := c.PostForm("precoComDesconto"); precoDesconto != "" {
        fmt.Sscanf(precoDesconto, "%f", &produto.PrecoComDesconto)
    }
    if estoque := c.PostForm("estoque"); estoque != "" {
        fmt.Sscanf(estoque, "%d", &produto.Estoque)
    }

    produto.Categoria = c.PostForm("categoria")
    produto.Reserva = c.PostForm("reserva") == "true"
    produto.Visivel = c.PostForm("visivel") == "true"

    form, err := c.MultipartForm()
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Falha ao processar arquivos"})
        return
    }

    files := form.File["img_upload"]
    if len(files) == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Pelo menos uma imagem é obrigatória"})
        return
    }

    var imagensPaths []string
    for _, file := range files {
        filename := fmt.Sprintf("uploads/%d_%s", time.Now().UnixNano(), file.Filename)
        if err := c.SaveUploadedFile(file, filename); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao salvar arquivo"})
            return
        }
        imagensPaths = append(imagensPaths, filename)
    }

    produto.Img = imagensPaths
    _, err = db.Model(&produto).Insert()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, produto)
}

func EditarProduto(c *gin.Context, db *pg.DB) {
    id := c.Param("id") 

    produto := &models.Produto{}
    err := db.Model(produto).Where("id = ?", id).Select()
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Produto não encontrado"})
        return
    }

    if nome := c.PostForm("nome"); nome != "" {
        produto.Nome = nome
    }
    if descricao := c.PostForm("descricao"); descricao != "" {
        produto.Descricao = descricao
    }
    if preco := c.PostForm("preco"); preco != "" {
        fmt.Sscanf(preco, "%f", &produto.Preco)
    }
    if precoDesconto := c.PostForm("precoComDesconto"); precoDesconto != "" {
        fmt.Sscanf(precoDesconto, "%f", &produto.PrecoComDesconto)
    }
    if estoque := c.PostForm("estoque"); estoque != "" {
        fmt.Sscanf(estoque, "%d", &produto.Estoque)
    }
    if categoria := c.PostForm("categoria"); categoria != "" {
        produto.Categoria = categoria
    }
    if reserva := c.PostForm("reserva"); reserva != "" {
        produto.Reserva = reserva == "true"
    }
    if visivel := c.PostForm("visivel"); visivel != "" {
        produto.Visivel = visivel == "true"
    }

    form, err := c.MultipartForm()
    if err == nil {
        files := form.File["img_upload"]
        if len(files) > 0 {
            var imagensPaths []string
            for _, file := range files {
                filename := fmt.Sprintf("uploads/%d_%s", time.Now().UnixNano(), file.Filename)
                if err := c.SaveUploadedFile(file, filename); err != nil {
                    c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao salvar arquivo"})
                    return
                }
                imagensPaths = append(imagensPaths, filename)
            }
            produto.Img = imagensPaths
        }
    }

    _, err = db.Model(produto).Where("id = ?", id).Update()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, produto)
}
