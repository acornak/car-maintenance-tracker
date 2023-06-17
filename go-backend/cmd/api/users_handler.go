package main

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/mail"

	"github.com/acornak/car-maintenance-tracker/models"
	"github.com/acornak/car-maintenance-tracker/token"

	"golang.org/x/crypto/bcrypt"
)

func (app *application) loginHandler(w http.ResponseWriter, r *http.Request) {
	type loginRequest struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	// Parse the request body into a loginRequest struct
	var req loginRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		sugar.Error(err)
		app.errorJson(w, err, http.StatusBadRequest)
		return
	}

	// Check if email is valid
	_, err = mail.ParseAddress(req.Email)
	if err != nil {
		sugar.Error(err)
		app.errorJson(w, err, http.StatusBadRequest)
		return
	}

	// Fetch user from database using email
	user, err := app.models.DB.GetByEmail(req.Email)
	if err != nil {
		app.errorJson(w, errors.New("invalid credentials"), http.StatusUnauthorized)
		return
	}

	// Check if the hashed password matches the one in the database
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		app.errorJson(w, errors.New("invalid credentials"), http.StatusUnauthorized)
		return
	}

	accessToken, err := token.GenerateAccessToken(user.ID)
	if err != nil {
		app.errorJson(w, errors.New("failed to create access token"), http.StatusInternalServerError)
		return
	}

	refreshToken, err := token.GenerateRefreshToken(user.ID)
	if err != nil {
		app.errorJson(w, errors.New("failed to create refresh token"), http.StatusInternalServerError)
	}

	// Send the token in the response
	app.writeJson(w, http.StatusOK, map[string]string{"access_token": accessToken, "refresh_token": refreshToken}, "")
}

func (app *application) registerHandler(w http.ResponseWriter, r *http.Request) {
	type registerRequest struct {
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
		Nickname  string `json:"nickname"`
		Email     string `json:"email"`
		Password  string `json:"password"`
	}
	// Parse the request body into a loginRequest struct
	var req registerRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		sugar.Error(err)
		app.errorJson(w, err, http.StatusBadRequest)
		return
	}

	// Check if email is valid
	_, err = mail.ParseAddress(req.Email)
	if err != nil {
		sugar.Error(err)
		app.errorJson(w, err, http.StatusBadRequest)
		return
	}

	// Check if password is valid
	if !isPasswordValid(req.Password) {
		err = errors.New("password does not meet the requirements")
		sugar.Error(err)
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
		sugar.Error(err)
		app.errorJson(w, err, http.StatusInternalServerError)
		return
	}

	app.writeJson(w, http.StatusCreated, nil, "")
	sugar.Info("successfully registered user: ", user.Email)
}

func (app *application) nicknamesHandler(w http.ResponseWriter, r *http.Request) {
	nicknames, err := app.models.DB.GetAllNicknames()
	if err != nil {
		sugar.Error(err)
		app.errorJson(w, err, http.StatusInternalServerError)
		return
	}

	sugar.Info("successfully retrieved all nicknames: ", nicknames)

	app.writeJson(w, http.StatusOK, nicknames, "nicknames")
}
