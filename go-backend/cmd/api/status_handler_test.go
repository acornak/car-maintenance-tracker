package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"go.uber.org/zap"
)

func TestStatusHandler(t *testing.T) {
	// Prepare a mock application and request
	app := &application{
		config: config{env: "test"},
		logger: zap.NewNop().Sugar(), // Use a no-op logger for testing
	}
	req, err := http.NewRequest(http.MethodGet, "/does-not-matter", nil)
	if err != nil {
		t.Fatalf("Could not create request: %v", err)
	}
	rr := httptest.NewRecorder()

	// Call the handler function
	app.statusHandler(rr, req)

	// Check the status code
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("Handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	// Check the body
	expected := AppStatus{
		Status:      "available",
		Environment: "test",
		Version:     version,
	}
	var got AppStatus
	err = json.NewDecoder(rr.Body).Decode(&got)
	if err != nil {
		t.Fatalf("Could not decode body: %v", err)
	}
	if got != expected {
		t.Errorf("Handler returned unexpected body: got %v want %v", got, expected)
	}
}
