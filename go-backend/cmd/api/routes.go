package main

import (
	"net/http"
)

func (app *application) routes() http.Handler {
	mux := http.NewServeMux()
	apiVersion := "/api/v1"

	// Define your routes without any prefix
	mux.HandleFunc(apiVersion+"/status", app.statusHandler)
	mux.HandleFunc(apiVersion+"/login", app.loginHandler)
	mux.HandleFunc(apiVersion+"/register", app.registerHandler)
	mux.HandleFunc(apiVersion+"/nicknames", app.nicknamesHandler)
	// mux.HandleFunc(apiVersion+"/update-user", app.registerHandler)

	return app.enableCORS(mux)
}
