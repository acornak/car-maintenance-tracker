package token

import (
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateAccessToken(userId int, signingKey []byte) (string, error) {
	claims := &jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Minute * 15)),
		ID:        strconv.Itoa(userId),
		Issuer:    "car-maintenance-tracker",
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(signingKey)
}

func GenerateRefreshToken(userId int, signingKey []byte) (string, error) {
	claims := &jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Minute * 60 * 24 * 7)),
		ID:        strconv.Itoa(userId),
		Issuer:    "car-maintenance-tracker",
		Subject:   "refresh",
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(signingKey)
}

func CheckTokenValidity(tokenString string, signingKey []byte) (bool, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return signingKey, nil
	})

	if err != nil {
		return false, err
	}

	return token.Valid, nil
}

func GetUserIdFromToken(tokenString string, signingKey []byte) (int, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return signingKey, nil
	})

	if err != nil {
		return 0, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return 0, err
	}

	userId, err := strconv.Atoi(claims["jti"].(string))
	if err != nil {
		return 0, err
	}

	return userId, nil
}
