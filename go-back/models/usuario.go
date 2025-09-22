package models

import (
    "time"
)

type Usuario struct {
    ID        int64     `json:"id" pg:",pk"`
    Email     string    `json:"email"`                     
    Password  string    `json:"password"`                  
    CreatedAt time.Time `json:"createdAt" pg:"default:now()"`
    UpdatedAt time.Time `json:"updatedAt"`
}
