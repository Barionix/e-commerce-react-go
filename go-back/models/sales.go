package models

import (
    "time"
)

type Sales struct {
    ID         int64     `json:"id" pg:",pk"`
    Code       string    `json:"code" pg:",notnull"`
    Nome       string    `json:"nome"`
    Chart      string    `json:"chart"`
    Preco      float64   `json:"preco" pg:",notnull"`
    ValorFinal float64   `json:"valorFinal"`
    Status     string    `json:"status" pg:"default:'Pending'"`
    CreatedAt  time.Time `json:"createdAt" pg:"default:now()"`
    UpdatedAt  time.Time `json:"updatedAt" pg:"default:now()"`
}
