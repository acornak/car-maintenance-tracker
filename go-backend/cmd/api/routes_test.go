package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestRoutes(t *testing.T) {
	app := &application{
		apiVersion: "v1",
		// Initialize or mock any other dependencies as needed
	}

	// Create a new request for each route and check if the handler is correctly assigned
	routes := []struct {
		method       string
		path         string
		handler      http.HandlerFunc
		expected     bool
		expectedBody string
	}{
		{method: "GET", path: "/api/v1/status", handler: app.statusHandler, expected: true, expectedBody: `{"status":"available","environment":"","version":"1.0.0"}`},
	}

	for _, route := range routes {
		req, err := http.NewRequest(route.method, route.path, nil)
		if err != nil {
			t.Fatalf("failed to create request for route %s: %v", route.path, err)
		}

		rr := httptest.NewRecorder()
		handler := app.routes()

		handler.ServeHTTP(rr, req)

		if (rr.Code == http.StatusOK) != route.expected {
			t.Errorf("unexpected response status for route %s, expected: %v, got: %v", route.path, route.expected, (rr.Code == http.StatusOK))
		}
		if route.expected && rr.Body.String() != route.expectedBody {
			t.Errorf("unexpected response body for route %s. expected: %s, got %s", route.path, route.expectedBody, rr.Body.String())
		}
	}
}
