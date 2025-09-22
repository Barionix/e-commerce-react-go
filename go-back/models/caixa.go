package models

import (
    "time"
)

type Caixa struct {
    ID             int64     `json:"id" pg:",pk"`
    SaldoTotal     float64   `json:"saldoTotal" pg:",use_zero,default:0"`     // required, default 0
    SaldoEstimado  float64   `json:"saldoEstimado" pg:",use_zero,default:0"`  // required, default 0
    DataAtualizacao time.Time `json:"dataAtualizacao" pg:"default:now()"`
}
