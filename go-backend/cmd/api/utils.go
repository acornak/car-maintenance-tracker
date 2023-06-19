package main

import (
	"errors"
	"regexp"
)

// Checks if a password is valid according to the given rules
func isPasswordValid(password string) bool {
	// at least 8 characters
	if len(password) < 8 {
		return false
	}

	// at least one lowercase character
	if !regexp.MustCompile(`[a-z]`).MatchString(password) {
		return false
	}

	// at least one uppercase character
	if !regexp.MustCompile(`[A-Z]`).MatchString(password) {
		return false
	}

	// at least one digit
	if !regexp.MustCompile(`[0-9]`).MatchString(password) {
		return false
	}

	// at least one special character
	if !regexp.MustCompile(`[!@#$%^&*]`).MatchString(password) {
		return false
	}

	return true
}

func validateConfig(cfg *config) error {
	if cfg.port == "" {
		return errors.New("missing port configuration")
	}

	if cfg.allowedOrigin == "" {
		return errors.New("missing allowedOrigin configuration")
	}

	if cfg.dbConn.port == "" {
		return errors.New("missing DB_PORT configuration")
	}

	if cfg.dbConn.host == "" {
		return errors.New("missing DB_HOST configuration")
	}

	if cfg.dbConn.user == "" {
		return errors.New("missing DB_USER configuration")
	}

	if cfg.dbConn.password == "" {
		return errors.New("missing DB_PASS configuration")
	}

	if cfg.dbConn.dbname == "" {
		return errors.New("missing DB_NAME configuration")
	}

	if cfg.dbConn.sslmode == "" {
		return errors.New("missing SSL_MODE configuration")
	}

	if len(cfg.jwtSigningKey) == 0 {
		return errors.New("missing JWT_SECRET configuration")
	}

	return nil
}
