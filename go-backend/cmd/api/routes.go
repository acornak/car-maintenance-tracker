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
	mux.HandleFunc(apiVersion+"/refresh-token", app.refreshTokenHandler)
	mux.HandleFunc(apiVersion+"/register", app.registerHandler)
	mux.HandleFunc(apiVersion+"/nicknames", app.nicknamesHandler)
	mux.HandleFunc(apiVersion+"/emails", app.emailsHandler)
	// mux.HandleFunc(apiVersion+"/update-user", app.registerHandler)

	// mux.Handle(apiVersion+"/user", app.validateTokenMiddleware(http.HandlerFunc(app.getUserHandler)))
	mux.HandleFunc(apiVersion+"/user", app.getUserHandler)

	mux.HandleFunc(apiVersion+"/cars/add", app.addCarHandler)
	mux.HandleFunc(apiVersion+"/cars/makers", app.getAllCarMakersHandler)
	mux.HandleFunc(apiVersion+"/cars/maker", app.getMakerByIDHandler)

	mux.HandleFunc(apiVersion+"/cars/models", app.getAllModelsByMakerIDHandler)
	mux.HandleFunc(apiVersion+"/cars/model", app.getModelByIDHandler)

	mux.HandleFunc(apiVersion+"/cars/get-by-user", app.getCarsByUserHandler)

	return app.enableCORS(mux)
}
