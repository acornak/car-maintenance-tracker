package main

import (
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
