package token

import (
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var mySigningKey = []byte(os.Getenv("JWT_SECRET"))

func GenerateAccessToken(userId int) (string, error) {
	claims := &jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Minute * 15)),
		ID:        strconv.Itoa(userId),
		Issuer:    "car-maintenance-tracker",
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(mySigningKey)
}

func GenerateRefreshToken(userId int) (string, error) {
	claims := &jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Minute * 15)),
		ID:        strconv.Itoa(userId),
		Issuer:    "car-maintenance-tracker",
		Subject:   "refresh",
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(mySigningKey)
}
