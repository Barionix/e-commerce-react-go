package utils

import (
	"math/rand"
	"time"
)

func GeraCodigoAleatorio() string {
	const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	rand.Seed(time.Now().UnixNano())

	codigo := make([]byte, 5)
	for i := 0; i < 5; i++ {
		codigo[i] = letras[rand.Intn(len(letras))]
	}
	return string(codigo)
}
