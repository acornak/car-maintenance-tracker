package main

import (
	"net/http"
	"os"
)

// func (app *application) enableCORS(next http.Handler) http.Handler {
// 	allowedOrigin := app.config.allowedOrigin

// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		origin := r.Header.Get("Origin")
// 		if origin == allowedOrigin {
// 			w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
// 			w.Header().Set("Access-Control-Allow-Headers", "Content-Type,Authorization")
// 			w.Header().Set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
// 			w.Header().Set("Access-Control-Allow-Credentials", "true")
// 		}

// 		// if this is a preflight request, we finish the request here
// 		if r.Method == "OPTIONS" {
// 			w.WriteHeader(http.StatusOK)
// 			return
// 		}

// 		next.ServeHTTP(w, r)
// 	})
// }

func (app *application) enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		allowedOrigin := os.Getenv("ALLOWED_ORIGIN")

		w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type,Authorization")
		w.Header().Set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		// if this is a preflight request, we finish the request here
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
