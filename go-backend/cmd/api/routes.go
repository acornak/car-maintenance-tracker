package main

import (
	"net/http"
)

func (app *application) routes() http.Handler {
	mux := http.NewServeMux()
	prefix := "/api/" + app.apiVersion

	mux.HandleFunc(prefix+"/status", app.statusHandler)
	mux.HandleFunc(prefix+"/login", app.loginHandler)
	mux.HandleFunc(prefix+"/refresh-token", app.refreshTokenHandler)
	mux.HandleFunc(prefix+"/register", app.registerHandler)
	mux.HandleFunc(prefix+"/check-nickname", app.checkNicknameHandler)
	mux.HandleFunc(prefix+"/check-email", app.checkEmailHandler)
	// mux.HandleFunc(prefix+"/update-user", app.registerHandler)

	mux.HandleFunc(prefix+"/user", app.getUserHandler)

	mux.HandleFunc(prefix+"/cars/add", app.addCarHandler)
	mux.HandleFunc(prefix+"/cars/makers", app.getAllCarMakersHandler)
	mux.HandleFunc(prefix+"/cars/maker", app.getMakerByIDHandler)

	mux.HandleFunc(prefix+"/cars/models", app.getAllModelsByMakerIDHandler)
	mux.HandleFunc(prefix+"/cars/model", app.getModelByIDHandler)
	mux.HandleFunc(prefix+"/cars/get", app.getCarByIDHandler)

	mux.HandleFunc(prefix+"/cars/get-by-user", app.getCarsByUserHandler)

	return app.enableCORS(mux)
}
