package models

import (
    "time"
)

type Produto struct {
    ID               int64     `json:"id" pg:",pk"`
    Nome             string    `json:"nome" pg:",notnull"`           // required
    Descricao        string    `json:"descricao"`                    // opcional
    Preco            float64   `json:"preco" pg:",notnull"`          // required
    PrecoComDesconto float64   `json:"precoComDesconto,default:0"`   // default 0
    Categoria        string    `json:"categoria" pg:",notnull"`      // required
    Estoque          int       `json:"estoque" pg:",use_zero"`       // required (use_zero evita null)
    Img              []string  `json:"img" pg:",array,notnull"`      // array de strings
    Reserva          bool      `json:"reserva" pg:",use_zero"`       // default false
    Visivel          bool      `json:"visivel" pg:",use_zero"`       // default false
    CreatedAt        time.Time `json:"createdAt" pg:"default:now()"` // timestamps
    UpdatedAt        time.Time `json:"updatedAt"`
}
