package models

import (
    "time"
)

type Chart struct {
    ID        int64     `json:"id" pg:",pk"`
    Code      string    `json:"code" pg:",notnull"`        // required
    Nome      string    `json:"nome"`                      // opcional
    ChartJSON string    `json:"chartJSON"`                 // opcional, pode guardar JSON como string
    Preco     float64   `json:"preco" pg:",notnull"`       // required
    CreatedAt time.Time `json:"createdAt" pg:"default:now()"`
    UpdatedAt time.Time `json:"updatedAt"`
}
