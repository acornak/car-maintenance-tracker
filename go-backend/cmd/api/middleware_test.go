package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

type mockHandler struct {
	called bool
}

func (m *mockHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	m.called = true
}

func TestEnableCORS(t *testing.T) {
	// Set up the test environment
	allowedOrigin := "http://example.com"

	app := &application{
		config: config{
			allowedOrigin: allowedOrigin,
		},
	}

	// Create a mock handler to test the middleware chain
	mock := &mockHandler{}

	// Call the enableCORS function to get the wrapped handler
	handler := app.enableCORS(mock)

	// Create a test request
	req := httptest.NewRequest("GET", "http://example.com", nil)
	req.Header.Set("Origin", allowedOrigin)

	// Create a test response recorder
	res := httptest.NewRecorder()

	// Call the handler
	handler.ServeHTTP(res, req)

	// Verify the response headers
	expectedHeaders := map[string]string{
		"Access-Control-Allow-Origin":      allowedOrigin,
		"Access-Control-Allow-Headers":     "Content-Type,Authorization",
		"Access-Control-Allow-Methods":     "GET,POST,PUT,DELETE,OPTIONS",
		"Access-Control-Allow-Credentials": "true",
	}
	for key, value := range expectedHeaders {
		if res.Header().Get(key) != value {
			t.Errorf("Expected header '%s' to be '%s', but got '%s'", key, value, res.Header().Get(key))
		}
	}

	// Verify if the mock handler was called
	if !mock.called {
		t.Error("Expected the next handler to be called, but it was not")
	}
}
