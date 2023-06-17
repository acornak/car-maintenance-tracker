package main

import (
	"encoding/json"
	"net/http"
	"net/mail"

	"github.com/acornak/car-maintenance-tracker/models"
)

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type loginResponse struct {
	Token string `json:"token"`
}

func (app *application) loginHandler(w http.ResponseWriter, r *http.Request) {
	// Parse the request body into a loginRequest struct
	var req loginRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		app.errorJson(w, err, http.StatusBadRequest)
		return
	}

	// Check if email is valid
	_, err = mail.ParseAddress(req.Email)
	if err != nil {
		app.errorJson(w, err, http.StatusBadRequest)
		return
	}
}

type registerRequest struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Nickname  string `json:"nickname"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

func (app *application) registerHandler(w http.ResponseWriter, r *http.Request) {
	// Parse the request body into a loginRequest struct
	var req registerRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		app.errorJson(w, err, http.StatusBadRequest)
		return
	}

	// Check if email is valid
	_, err = mail.ParseAddress(req.Email)
	if err != nil {
		app.errorJson(w, err, http.StatusBadRequest)
		return
	}

	user := models.User{
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Nickname:  req.Nickname,
		Email:     req.Email,
		Password:  req.Password,
	}

	// Call the Insert method on the models, passing in the user
	err = app.models.DB.Insert(user)
	if err != nil {
		app.errorJson(w, err, http.StatusInternalServerError)
		return
	}

	app.writeJson(w, http.StatusCreated, nil, "")
	sugar.Info("successfully registered user: ", user.Email)
}
