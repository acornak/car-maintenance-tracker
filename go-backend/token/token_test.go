package token_test

import (
	"testing"

	"github.com/acornak/car-maintenance-tracker/token"
)

func TestTokens(t *testing.T) {
	// Setup
	signingKey := []byte("asdf")

	// Test ID to use
	testID := 123

	// Generate Access Token
	accessToken, err := token.GenerateAccessToken(testID, signingKey)
	if err != nil {
		t.Fatal("Failed to generate access token:", err)
	}

	// Check if access token is valid
	valid, err := token.CheckTokenValidity(accessToken, signingKey)
	if err != nil || !valid {
		t.Fatal("Access token is invalid:", err)
	}

	// Extract ID from access token
	id, err := token.GetUserIdFromToken(accessToken, signingKey)
	if err != nil {
		t.Fatal("Failed to extract ID from access token:", err)
	}

	// Check if the ID matches
	if id != testID {
		t.Fatalf("ID mismatch: got %v, expected %v", id, testID)
	}

	// Generate Refresh Token
	refreshToken, err := token.GenerateRefreshToken(testID, signingKey)
	if err != nil {
		t.Fatal("Failed to generate refresh token:", err)
	}

	// Check if refresh token is valid
	valid, err = token.CheckTokenValidity(refreshToken, signingKey)
	if err != nil || !valid {
		t.Fatal("Refresh token is invalid:", err)
	}

	// Extract ID from refresh token
	id, err = token.GetUserIdFromToken(refreshToken, signingKey)
	if err != nil {
		t.Fatal("Failed to extract ID from refresh token:", err)
	}

	// Check if the ID matches
	if id != testID {
		t.Fatalf("ID mismatch: got %v, expected %v", id, testID)
	}
}
