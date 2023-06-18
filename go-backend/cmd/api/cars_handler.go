package main

import (
	"encoding/json"
	"net/http"

	"github.com/acornak/car-maintenance-tracker/models"
	"github.com/acornak/car-maintenance-tracker/token"
)

func (app *application) addCarHandler(w http.ResponseWriter, r *http.Request) {
	// Get token from the cookie
	cookie, err := r.Cookie("access_token")
	if err != nil {
		sugar.Error(err)
		if err == http.ErrNoCookie {
			// If the cookie is not set, return an unauthorized status
			sugar.Error("no cookie found")
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		// For any other type of error, return a bad request status
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	tokenString := cookie.Value
	isValid, err := token.CheckTokenValidity(tokenString)
	if err != nil {
		sugar.Error(err)
		app.errorJson(w, err, http.StatusInternalServerError)
		return
	}

	if !isValid {
		sugar.Error("token is not valid")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	userId, err := token.GetUserIdFromToken(tokenString)
	if err != nil {
		sugar.Error(err)
		app.errorJson(w, err, http.StatusInternalServerError)
		return
	}

	// Parse the request body into a addCarRequest struct
	var req models.Car
	err = json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		sugar.Error(err)
		app.errorJson(w, err, http.StatusBadRequest)
		return
	}

	// Create a new car
	car := models.Car{
		UserId:      userId,
		Brand:       req.Brand,
		Model:       req.Model,
		Year:        req.Year,
		Color:       req.Color,
		Price:       req.Price,
		Image:       req.Image,
		Description: req.Description,
	}

	// Insert the car into the database
	err = app.models.DB.InsertCar(car)
	if err != nil {
		sugar.Error(err)
		app.errorJson(w, err, http.StatusInternalServerError)
		return
	}

	// Return a 201 status code
	w.WriteHeader(http.StatusCreated)
}

func (app *application) getCarsByUserHandler(w http.ResponseWriter, r *http.Request) {
	// Get token from the cookie
	cookie, err := r.Cookie("access_token")
	if err != nil {
		sugar.Error(err)
		if err == http.ErrNoCookie {
			// If the cookie is not set, return an unauthorized status
			sugar.Error("no cookie found")
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		// For any other type of error, return a bad request status
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	tokenString := cookie.Value
	isValid, err := token.CheckTokenValidity(tokenString)
	if err != nil {
		sugar.Error(err)
		app.errorJson(w, err, http.StatusInternalServerError)
		return
	}

	if !isValid {
		sugar.Error("token is not valid")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	userId, err := token.GetUserIdFromToken(tokenString)
	if err != nil {
		sugar.Error(err)
		app.errorJson(w, err, http.StatusInternalServerError)
		return
	}

	cars, err := app.models.DB.GetCarsByUserID(userId)
	if err != nil {
		sugar.Error(err)
		app.errorJson(w, err, http.StatusInternalServerError)
		return
	}

	app.writeJson(w, http.StatusOK, cars, "cars")
}
