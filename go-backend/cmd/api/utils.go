package main

import (
	"encoding/json"
	"net/http"
	"regexp"
)

func (app *application) writeJson(w http.ResponseWriter, status int, data interface{}, wrap string) error {
	if wrap != "" {
		wrapper := make(map[string]interface{})
		wrapper[wrap] = data
		data = wrapper
	}

	js, err := json.Marshal(data)
	if err != nil {
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(js)

	return nil
}

func (app *application) errorJson(w http.ResponseWriter, err error, status ...int) {
	statusCode := http.StatusBadRequest
	if len(status) > 0 {
		statusCode = status[0]
	}

	type jsonError struct {
		Message string `json:"message"`
	}

	errMessage := jsonError{
		Message: err.Error(),
	}

	app.writeJson(w, statusCode, errMessage, "error")
}

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
