package models_test

import (
	"database/sql"
	"errors"
	"testing"
	"time"

	sqlmock "github.com/DATA-DOG/go-sqlmock"
	"github.com/acornak/car-maintenance-tracker/models"
	"github.com/stretchr/testify/assert"
)

func TestInsertCar(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	mock.ExpectExec(`INSERT INTO users_cars`).WithArgs(
		1,                    // user_id
		1,                    // brand_id
		1,                    // model_id
		2022,                 // year
		"red",                // color
		50000,                // price
		"image.jpg",          // image
		"This is a test car", // description
		"ABC123",             // license_plate
		"1HGCM82633A123456",  // vin
	).WillReturnResult(sqlmock.NewResult(1, 1))

	modelsDB := models.NewModels(db)
	testCar := models.Car{
		UserId:       1,
		BrandID:      1,
		ModelID:      1,
		Year:         2022,
		Color:        "red",
		Price:        50000,
		Image:        "image.jpg",
		Description:  "This is a test car",
		LicensePlate: "ABC123",
		VIN:          "1HGCM82633A123456",
	}

	err = modelsDB.DB.InsertCar(testCar)

	assert.NoError(t, err)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestInsertCar_Error(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	mock.ExpectExec(`INSERT INTO users_cars`).WithArgs(
		1,                    // user_id
		1,                    // brand_id
		1,                    // model_id
		2022,                 // year
		"red",                // color
		50000,                // price
		"image.jpg",          // image
		"This is a test car", // description
		"ABC123",             // license_plate
		"1HGCM82633A123456",  // vin
	).WillReturnError(errors.New("mocked error"))

	modelsDB := models.NewModels(db)
	testCar := models.Car{
		UserId:       1,
		BrandID:      1,
		ModelID:      1,
		Year:         2022,
		Color:        "red",
		Price:        50000,
		Image:        "image.jpg",
		Description:  "This is a test car",
		LicensePlate: "ABC123",
		VIN:          "1HGCM82633A123456",
	}

	err = modelsDB.DB.InsertCar(testCar)

	assert.Error(t, err)
	assert.EqualError(t, err, "mocked error")
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestRemoveCar_Success(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	mock.ExpectExec(`DELETE FROM users_cars WHERE id`).WithArgs(1).WillReturnResult(sqlmock.NewResult(1, 1))

	modelsDB := models.NewModels(db)
	err = modelsDB.DB.RemoveCar(1)

	assert.NoError(t, err)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestRemoveCar_Error(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	mock.ExpectExec(`DELETE FROM users_cars WHERE id`).WithArgs(1).WillReturnError(errors.New("mocked error"))

	modelsDB := models.NewModels(db)
	err = modelsDB.DB.RemoveCar(1)

	assert.Error(t, err)
	assert.EqualError(t, err, "mocked error")
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetCarsByUserID_Success(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	rows := sqlmock.NewRows([]string{"id", "user_id", "brand_id", "model_id", "year", "color", "price", "image", "description", "license_plate", "vin", "created_at"}).
		AddRow(1, 1, 1, 1, 2022, "red", 50000, "image.jpg", "This is car 1", "ABC123", "1HGCM82633A123456", "2023-06-19 12:00:00").
		AddRow(2, 1, 2, 2, 2023, "blue", 60000, "image2.jpg", "This is car 2", "DEF456", "2HGCM82633A654321", "2023-06-19 13:00:00")

	mock.ExpectQuery(`SELECT (.+) FROM users_cars WHERE user_id=`).WithArgs(1).WillReturnRows(rows)

	modelsDB := models.NewModels(db)
	cars, err := modelsDB.DB.GetCarsByUserID(1)

	expectedCars := []models.Car{
		{
			ID:           1,
			UserId:       1,
			BrandID:      1,
			ModelID:      1,
			Year:         2022,
			Color:        "red",
			Price:        50000,
			Image:        "image.jpg",
			Description:  "This is car 1",
			LicensePlate: "ABC123",
			VIN:          "1HGCM82633A123456",
			CreatedAt:    "2023-06-19 12:00:00",
		},
		{
			ID:           2,
			UserId:       1,
			BrandID:      2,
			ModelID:      2,
			Year:         2023,
			Color:        "blue",
			Price:        60000,
			Image:        "image2.jpg",
			Description:  "This is car 2",
			LicensePlate: "DEF456",
			VIN:          "2HGCM82633A654321",
			CreatedAt:    "2023-06-19 13:00:00",
		},
	}

	assert.NoError(t, err)
	assert.Equal(t, expectedCars, cars)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetCarsByUserID_NoRows(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	rows := sqlmock.NewRows([]string{"id", "user_id", "brand_id", "model_id", "year", "color", "price", "image", "description", "license_plate", "vin", "created_at"})

	mock.ExpectQuery(`SELECT (.+) FROM users_cars WHERE user_id=`).WithArgs(1).WillReturnRows(rows)

	modelsDB := models.NewModels(db)
	cars, err := modelsDB.DB.GetCarsByUserID(1)

	assert.NoError(t, err)
	assert.Empty(t, cars)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetCarsByUserID_Error(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	mock.ExpectQuery(`SELECT (.+) FROM users_cars WHERE user_id=`).WithArgs(1).WillReturnError(errors.New("mocked error"))

	modelsDB := models.NewModels(db)
	cars, err := modelsDB.DB.GetCarsByUserID(1)

	assert.Error(t, err)
	assert.EqualError(t, err, "mocked error")
	assert.Nil(t, cars)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetAllCarMakers_Success(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	rows := sqlmock.NewRows([]string{"id", "name"}).
		AddRow(1, "Maker A").
		AddRow(2, "Maker B").
		AddRow(3, "Maker C")

	mock.ExpectQuery("SELECT id, name FROM car_makers").WillReturnRows(rows)

	modelsDB := models.NewModels(db)
	carMakers, err := modelsDB.DB.GetAllCarMakers()

	expectedCarMakers := []models.CarMaker{
		{
			ID:   1,
			Name: "Maker A",
		},
		{
			ID:   2,
			Name: "Maker B",
		},
		{
			ID:   3,
			Name: "Maker C",
		},
	}

	assert.NoError(t, err)
	assert.Equal(t, expectedCarMakers, carMakers)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetAllCarMakers_NoRows(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	rows := sqlmock.NewRows([]string{"id", "name"})

	mock.ExpectQuery("SELECT id, name FROM car_makers").WillReturnRows(rows)

	modelsDB := models.NewModels(db)
	carMakers, err := modelsDB.DB.GetAllCarMakers()

	assert.NoError(t, err)
	assert.Empty(t, carMakers)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetAllCarMakers_Error(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	mock.ExpectQuery("SELECT id, name FROM car_makers").WillReturnError(errors.New("mocked error"))

	modelsDB := models.NewModels(db)
	carMakers, err := modelsDB.DB.GetAllCarMakers()

	assert.Error(t, err)
	assert.EqualError(t, err, "mocked error")
	assert.Nil(t, carMakers)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetModelsByMakerID_Success(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	rows := sqlmock.NewRows([]string{"id", "name"}).
		AddRow(1, "Model A").
		AddRow(2, "Model B").
		AddRow(3, "Model C")

	mock.ExpectQuery("SELECT id, name FROM car_models WHERE car_maker_id=").WithArgs(1).WillReturnRows(rows)

	modelsDB := models.NewModels(db)
	carModels, err := modelsDB.DB.GetModelsByMakerID(1)

	expectedCarModels := []models.CarModel{
		{
			ID:   1,
			Name: "Model A",
		},
		{
			ID:   2,
			Name: "Model B",
		},
		{
			ID:   3,
			Name: "Model C",
		},
	}

	assert.NoError(t, err)
	assert.Equal(t, expectedCarModels, carModels)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetModelsByMakerID_NoRows(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	rows := sqlmock.NewRows([]string{"id", "name"})

	mock.ExpectQuery("SELECT id, name FROM car_models WHERE car_maker_id=").WithArgs(1).WillReturnRows(rows)

	modelsDB := models.NewModels(db)
	carModels, err := modelsDB.DB.GetModelsByMakerID(1)

	assert.NoError(t, err)
	assert.Empty(t, carModels)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetModelsByMakerID_Error(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	mock.ExpectQuery("SELECT id, name FROM car_models WHERE car_maker_id=").WithArgs(1).WillReturnError(errors.New("mocked error"))

	modelsDB := models.NewModels(db)
	carModels, err := modelsDB.DB.GetModelsByMakerID(1)

	assert.Error(t, err)
	assert.EqualError(t, err, "mocked error")
	assert.Nil(t, carModels)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetMakerByID_Success(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	row := sqlmock.NewRows([]string{"id", "name"}).
		AddRow(1, "Maker A")

	mock.ExpectQuery("SELECT id, name FROM car_makers WHERE id=").WithArgs(1).WillReturnRows(row)

	modelsDB := models.NewModels(db)
	carMaker, err := modelsDB.DB.GetMakerByID(1)

	expectedCarMaker := models.CarMaker{
		ID:   1,
		Name: "Maker A",
	}

	assert.NoError(t, err)
	assert.Equal(t, expectedCarMaker, carMaker)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetMakerByID_NotFound(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	mock.ExpectQuery("SELECT id, name FROM car_makers WHERE id=").WithArgs(1).WillReturnError(sql.ErrNoRows)

	modelsDB := models.NewModels(db)
	carMaker, err := modelsDB.DB.GetMakerByID(1)

	assert.Error(t, err)
	assert.EqualError(t, err, "sql: no rows in result set")
	assert.Equal(t, models.CarMaker{}, carMaker)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetMakerByID_Error(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	mock.ExpectQuery("SELECT id, name FROM car_makers WHERE id=").WithArgs(1).WillReturnError(errors.New("mocked error"))

	modelsDB := models.NewModels(db)
	carMaker, err := modelsDB.DB.GetMakerByID(1)

	assert.Error(t, err)
	assert.EqualError(t, err, "mocked error")
	assert.Equal(t, models.CarMaker{}, carMaker)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetModelByID_Success(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	row := sqlmock.NewRows([]string{"id", "name"}).
		AddRow(1, "Model A")

	mock.ExpectQuery("SELECT id, name FROM car_models WHERE id=").WithArgs(1).WillReturnRows(row)

	modelsDB := models.NewModels(db)
	carModel, err := modelsDB.DB.GetModelByID(1)

	expectedCarModel := models.CarModel{
		ID:   1,
		Name: "Model A",
	}

	assert.NoError(t, err)
	assert.Equal(t, expectedCarModel, carModel)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetModelByID_NotFound(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	mock.ExpectQuery("SELECT id, name FROM car_models WHERE id=").WithArgs(1).WillReturnError(sql.ErrNoRows)

	modelsDB := models.NewModels(db)
	carModel, err := modelsDB.DB.GetModelByID(1)

	assert.Error(t, err)
	assert.EqualError(t, err, "sql: no rows in result set")
	assert.Equal(t, models.CarModel{}, carModel)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetModelByID_Error(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	mock.ExpectQuery("SELECT id, name FROM car_models WHERE id=").WithArgs(1).WillReturnError(errors.New("mocked error"))

	modelsDB := models.NewModels(db)
	carModel, err := modelsDB.DB.GetModelByID(1)

	assert.Error(t, err)
	assert.EqualError(t, err, "mocked error")
	assert.Equal(t, models.CarModel{}, carModel)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetCarByID_Success(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	currentTime := time.Now()
	formattedTime := currentTime.Format("2006-01-02T15:04:05.000000-07:00")

	row := sqlmock.NewRows([]string{
		"id", "user_id", "brand_id", "model_id", "year", "color", "price",
		"image", "description", "license_plate", "vin", "created_at",
	}).AddRow(
		1, 1, 1, 1, 2022, "red", 50000,
		"image.jpg", "This is a test car", "ABC123", "1HGCM82633A123456", formattedTime,
	)

	mock.ExpectQuery("SELECT id, user_id, brand_id, model_id, year, color, price, image, description, license_plate, vin, created_at FROM users_cars WHERE id=").WithArgs(1).WillReturnRows(row)

	modelsDB := models.NewModels(db)
	car, err := modelsDB.DB.GetCarByID(1)

	expectedCar := models.Car{
		ID:           1,
		UserId:       1,
		BrandID:      1,
		ModelID:      1,
		Year:         2022,
		Color:        "red",
		Price:        50000,
		Image:        "image.jpg",
		Description:  "This is a test car",
		LicensePlate: "ABC123",
		VIN:          "1HGCM82633A123456",
		CreatedAt:    formattedTime,
	}

	assert.NoError(t, err)
	assert.Equal(t, expectedCar, car)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetCarByID_NotFound(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	mock.ExpectQuery("SELECT id, user_id, brand_id, model_id, year, color, price, image, description, license_plate, vin, created_at FROM users_cars WHERE id=").WithArgs(1).WillReturnError(sql.ErrNoRows)

	modelsDB := models.NewModels(db)
	car, err := modelsDB.DB.GetCarByID(1)

	assert.Error(t, err)
	assert.EqualError(t, err, "sql: no rows in result set")
	assert.Equal(t, models.Car{}, car)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetCarByID_Error(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	mock.ExpectQuery("SELECT id, user_id, brand_id, model_id, year, color, price, image, description, license_plate, vin, created_at FROM users_cars WHERE id=").WithArgs(1).WillReturnError(errors.New("mocked error"))

	modelsDB := models.NewModels(db)
	car, err := modelsDB.DB.GetCarByID(1)

	assert.Error(t, err)
	assert.EqualError(t, err, "mocked error")
	assert.Equal(t, models.Car{}, car)
	assert.NoError(t, mock.ExpectationsWereMet())
}
