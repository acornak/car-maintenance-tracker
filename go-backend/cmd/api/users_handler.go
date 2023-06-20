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
		app.logger.Error(err)
		app.writer.ErrorJson(w, err, http.StatusBadRequest)
		return
	}

	// Check if email is valid
	_, err = mail.ParseAddress(req.Email)
	if err != nil {
		app.logger.Error(err)
		app.writer.ErrorJson(w, err, http.StatusBadRequest)
		return
	}

	// Fetch user from database using email
	user, err := app.models.DB.GetUserByEmail(req.Email)
	if err != nil {
		app.writer.ErrorJson(w, errors.New("invalid credentials"), http.StatusUnauthorized)
		return
	}

	// Check if the hashed password matches the one in the database
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		app.writer.ErrorJson(w, errors.New("invalid credentials"), http.StatusUnauthorized)
		return
	}

	accessToken, err := token.GenerateAccessToken(user.ID, app.config.jwtSigningKey)
	if err != nil {
		app.writer.ErrorJson(w, errors.New("failed to create access token"), http.StatusInternalServerError)
		return
	}

	refreshToken, err := token.GenerateRefreshToken(user.ID, app.config.jwtSigningKey)
	if err != nil {
		app.writer.ErrorJson(w, errors.New("failed to create refresh token"), http.StatusInternalServerError)
	}

	// Set the access token as an HTTP-only cookie
	accessCookie := http.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		Path:     "/",
		HttpOnly: true,
		Secure:   false, // Set to true if using HTTPS
	}
	http.SetCookie(w, &accessCookie)

	// Set the refresh token as an HTTP-only cookie
	refreshCookie := http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		Path:     "/",
		HttpOnly: true,
		Secure:   false, // Set to true if using HTTPS
	}
	http.SetCookie(w, &refreshCookie)

	user.Password = ""

	// Send the token in the response
	app.writer.WriteJson(w, http.StatusOK, user, "user")
}

func (app *application) refreshTokenHandler(w http.ResponseWriter, r *http.Request) {
	// Get token from the cookie
	cookie, err := r.Cookie("refresh_token")
	if err != nil {
		app.logger.Error(err)
		if err == http.ErrNoCookie {
			// If the cookie is not set, return an unauthorized status
			app.logger.Error("no cookie found")
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		// For any other type of error, return a bad request status
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	tokenString := cookie.Value
	isValid, err := token.CheckTokenValidity(tokenString, app.config.jwtSigningKey)
	if err != nil {
		app.logger.Error(err)
		app.writer.ErrorJson(w, err, http.StatusInternalServerError)
		return
	}

	if !isValid {
		app.logger.Error("token is not valid")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	userId, err := token.GetUserIdFromToken(tokenString, app.config.jwtSigningKey)
	if err != nil {
		app.logger.Error(err)
		app.writer.ErrorJson(w, err, http.StatusInternalServerError)
		return
	}

	accessToken, err := token.GenerateAccessToken(userId, app.config.jwtSigningKey)
	if err != nil {
		app.writer.ErrorJson(w, errors.New("failed to create access token"), http.StatusInternalServerError)
		return
	}

	// Set the access token as an HTTP-only cookie
	accessCookie := http.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		Path:     "/",
		HttpOnly: true,
		Secure:   false, // Set to true if using HTTPS
	}
	http.SetCookie(w, &accessCookie)

	app.writer.WriteJson(w, http.StatusOK, nil, "")
	app.logger.Info("successfully refreshed token")
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
		app.logger.Error(err)
		app.writer.ErrorJson(w, err, http.StatusBadRequest)
		return
	}

	// Check if email is valid
	_, err = mail.ParseAddress(req.Email)
	if err != nil {
		app.logger.Error(err)
		app.writer.ErrorJson(w, err, http.StatusBadRequest)
		return
	}

	// Check if password is valid
	if !isPasswordValid(req.Password) {
		err = errors.New("password does not meet the requirements")
		app.logger.Error(err)
		app.writer.ErrorJson(w, err, http.StatusBadRequest)
		return
	}

	// Check if email is unique
	exists, err := app.models.DB.CheckEmailExists(req.Email)
	if err != nil {
		app.logger.Error(err)
		app.writer.ErrorJson(w, err, http.StatusInternalServerError)
		return
	}

	if exists {
		err = errors.New("a user with the email address '" + req.Email + "' already exists")
		app.logger.Error(err)
		app.writer.ErrorJson(w, err, http.StatusBadRequest)
		return
	}

	// Check if nickname is unique
	exists, err = app.models.DB.CheckNicknameExists(req.Nickname)
	if err != nil {
		app.logger.Error(err)
		app.writer.ErrorJson(w, err, http.StatusInternalServerError)
		return
	}

	if exists {
		err = errors.New("a user with the nickname '" + req.Nickname + "' already exists")
		app.logger.Error(err)
		app.writer.ErrorJson(w, err, http.StatusBadRequest)
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
	err = app.models.DB.InsertUser(user)
	if err != nil {
		app.logger.Error(err)
		app.writer.ErrorJson(w, err, http.StatusInternalServerError)
		return
	}

	app.writer.WriteJson(w, http.StatusCreated, nil, "")
	app.logger.Info("successfully registered user: ", user.Email)
}

func (app *application) checkNicknameHandler(w http.ResponseWriter, r *http.Request) {
	type checkNicknameRequest struct {
		Nickname string `json:"nickname"`
	}
	var req checkNicknameRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		app.logger.Error(err)
		app.writer.ErrorJson(w, err, http.StatusBadRequest)
		return
	}

	exists, err := app.models.DB.CheckNicknameExists(req.Nickname)
	if err != nil {
		app.logger.Error(err)
		app.writer.ErrorJson(w, err, http.StatusInternalServerError)
		return
	}

	if exists {
		app.writer.WriteJson(w, http.StatusOK, nil, "")
		app.logger.Info("nickname already exists: ", req.Nickname)
	} else {
		app.writer.WriteJson(w, http.StatusNotFound, nil, "")
	}
}

func (app *application) checkEmailHandler(w http.ResponseWriter, r *http.Request) {
	type checkEmailRequest struct {
		Email string `json:"email"`
	}
	// Parse the request body into a loginRequest struct
	var req checkEmailRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		app.logger.Error(err)
		app.writer.ErrorJson(w, err, http.StatusBadRequest)
		return
	}

	exists, err := app.models.DB.CheckEmailExists(req.Email)
	if err != nil {
		app.logger.Error(err)
		app.writer.ErrorJson(w, err, http.StatusInternalServerError)
		return
	}

	if exists {
		app.writer.WriteJson(w, http.StatusOK, nil, "")
		app.logger.Info("email already exists: ", req.Email)
	} else {
		app.writer.WriteJson(w, http.StatusNotFound, nil, "")
	}
}

func (app *application) getUserHandler(w http.ResponseWriter, r *http.Request) {
	// Get token from the cookie
	cookie, err := r.Cookie("access_token")
	if err != nil {
		app.logger.Error(err)
		if err == http.ErrNoCookie {
			// If the cookie is not set, return an unauthorized status
			app.logger.Error("no cookie found")
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		// For any other type of error, return a bad request status
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	tokenString := cookie.Value
	isValid, err := token.CheckTokenValidity(tokenString, app.config.jwtSigningKey)
	if err != nil {
		app.logger.Error(err)
		app.writer.ErrorJson(w, err, http.StatusInternalServerError)
		return
	}

	if !isValid {
		app.logger.Error("token is not valid")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	userId, err := token.GetUserIdFromToken(tokenString, app.config.jwtSigningKey)
	if err != nil {
		app.logger.Error(err)
		app.writer.ErrorJson(w, err, http.StatusInternalServerError)
		return
	}

	// Proceed with the getUserByID logic as the token is now validated
	user, err := app.models.DB.GetUserByID(userId)
	if err != nil {
		app.logger.Error(err)
		app.writer.ErrorJson(w, err, http.StatusInternalServerError)
		return
	}

	// Send the user in the response
	app.writer.WriteJson(w, http.StatusOK, user, "user")
}
