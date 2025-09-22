package models

import (
    "time"
)

type Movimentacao struct {
    ID        int64     `json:"id" pg:",pk"`
    Tipo      string    `json:"tipo" pg:",notnull"`       // "entrada" ou "saida", required
    Nome      string    `json:"nome" pg:",notnull"`       // required
    Descricao string    `json:"descricao"`                // opcional
    Valor     float64   `json:"valor" pg:",notnull"`      // required
    Data      time.Time `json:"data" pg:"default:now()"`  // default Date.now
}
