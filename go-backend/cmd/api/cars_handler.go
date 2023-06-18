package main

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

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
		UserId:       userId,
		BrandID:      req.BrandID,
		ModelID:      req.ModelID,
		Year:         req.Year,
		Color:        req.Color,
		Price:        req.Price,
		Image:        req.Image,
		LicensePlate: req.LicensePlate,
		VIN:          req.VIN,
		Description:  req.Description,
	}

	sugar.Info("car", car)
	sugar.Info("req BrandID", req.BrandID)
	sugar.Info("req ModelID", req.ModelID)

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

func (app *application) getAllCarMakersHandler(w http.ResponseWriter, r *http.Request) {
	carMakers, err := app.models.DB.GetAllCarMakers()
	if err != nil {
		sugar.Error(err)
		app.errorJson(w, err, http.StatusInternalServerError)
		return
	}

	app.writeJson(w, http.StatusOK, carMakers, "makers")
}

func (app *application) getAllModelsByMakerIDHandler(w http.ResponseWriter, r *http.Request) {
	type getModelsRequest struct {
		MakerID int `json:"maker_id"`
	}
	// Parse the request body into a loginRequest struct
	var req getModelsRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		sugar.Error(err)
		app.errorJson(w, err, http.StatusBadRequest)
		return
	}

	carModels, err := app.models.DB.GetModelsByMakerID(req.MakerID)

	if err != nil {
		sugar.Error(err)
		app.errorJson(w, err, http.StatusInternalServerError)
		return
	}

	app.writeJson(w, http.StatusOK, carModels, "models")
}

func (app *application) getMakerByIDHandler(w http.ResponseWriter, r *http.Request) {
	// Get the id parameter from the request URL
	id := r.URL.Query().Get("id")

	// Parse the id parameter as an integer
	makerID, err := strconv.Atoi(id)
	if err != nil {
		sugar.Error(err)
		app.errorJson(w, err, http.StatusBadRequest)
		return
	}

	carMaker, err := app.models.DB.GetMakerByID(makerID)

	if err != nil {
		sugar.Error(err)
		app.errorJson(w, err, http.StatusInternalServerError)
		return
	}

	app.writeJson(w, http.StatusOK, carMaker, "maker")
}

func (app *application) getModelByIDHandler(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")

	// Parse the id parameter as an integer
	modelID, err := strconv.Atoi(id)
	if err != nil {
		sugar.Error(err)
		app.errorJson(w, err, http.StatusBadRequest)
		return
	}

	carModel, err := app.models.DB.GetModelByID(modelID)

	if err != nil {
		sugar.Error(err)
		app.errorJson(w, err, http.StatusInternalServerError)
		return
	}

	app.writeJson(w, http.StatusOK, carModel, "model")
}

func (app *application) getCarByIDHandler(w http.ResponseWriter, r *http.Request) {
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

	// Get the id parameter from the request URL
	id := r.URL.Query().Get("id")

	// Parse the id parameter as an integer
	carId, err := strconv.Atoi(id)
	if err != nil {
		sugar.Error(err)
		app.errorJson(w, err, http.StatusBadRequest)
		return
	}

	car, err := app.models.DB.GetCarByID(carId)
	if err != nil {
		sugar.Error(err)
		app.errorJson(w, errors.New("user is not authorized to get this car"), http.StatusUnauthorized)
		return
	}

	if car.UserId != userId {
		sugar.Error("user is not authorized to get this car")
		app.errorJson(w, errors.New("user is not authorized to get this car"), http.StatusUnauthorized)
		return
	}

	app.writeJson(w, http.StatusOK, car, "car")
}
