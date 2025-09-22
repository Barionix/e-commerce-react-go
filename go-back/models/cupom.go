package models

import (
    "time"
)

type Cupom struct {
    ID        int64     `json:"id" pg:",pk"`
    Code      string    `json:"code" pg:",notnull"`        // required
    Autor     string    `json:"autor"`                     // opcional
    Desconto  float64   `json:"desconto" pg:",notnull"`    // required
    CreatedAt time.Time `json:"createdAt" pg:"default:now()"`
    UpdatedAt time.Time `json:"updatedAt"`
}
