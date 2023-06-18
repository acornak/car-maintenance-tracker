package models

type Car struct {
	ID           int    `json:"id"`
	UserId       int    `json:"user_id"`
	BrandID      int    `json:"brand_id"`
	ModelID      int    `json:"model_id"`
	Year         int    `json:"year,string,omitempty"`
	Color        string `json:"color,omitempty"`
	Price        int    `json:"price,string,omitempty"`
	Image        string `json:"image"`
	Description  string `json:"description,omitempty"`
	LicensePlate string `json:"license_plate,omitempty"`
	VIN          string `json:"vin,omitempty"`
	CreatedAt    string `json:"created_at"`
}

type CarMaker struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type CarModel struct {
	ID         int    `json:"id"`
	CarMakerID int    `json:"car_maker_id"`
	Name       string `json:"name"`
}

func (m *DBModel) InsertCar(car Car) error {
	stmt := `INSERT INTO users_cars (user_id, brand_id, model_id, year, color, price, image, description, license_plate, vin) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`

	_, err := m.DB.Exec(stmt, car.UserId, car.BrandID, car.ModelID, car.Year, car.Color, car.Price, car.Image, car.Description, car.LicensePlate, car.VIN)
	if err != nil {
		return err
	}

	return nil
}

func (m *DBModel) RemoveCar(carId int) error {
	stmt := `DELETE FROM users_cars WHERE id=$1`

	_, err := m.DB.Exec(stmt, carId)
	if err != nil {
		return err
	}

	return nil
}

func (m *DBModel) GetCarsByUserID(userId int) ([]Car, error) {
	stmt := `SELECT id, user_id, brand_id, model_id, year, color, price, image, description, license_plate, vin, created_at FROM users_cars WHERE user_id=$1`

	rows, err := m.DB.Query(stmt, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var cars []Car

	for rows.Next() {
		var car Car

		err := rows.Scan(&car.ID, &car.UserId, &car.BrandID, &car.ModelID, &car.Year, &car.Color, &car.Price, &car.Image, &car.Description, &car.LicensePlate, &car.VIN, &car.CreatedAt)
		if err != nil {
			return nil, err
		}

		cars = append(cars, car)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return cars, nil
}

func (m *DBModel) GetAllCarMakers() ([]CarMaker, error) {
	rows, err := m.DB.Query("SELECT id, name FROM car_makers ORDER BY name ASC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var carMakers []CarMaker
	for rows.Next() {
		var carMaker CarMaker
		err = rows.Scan(&carMaker.ID, &carMaker.Name)
		if err != nil {
			return nil, err
		}
		carMakers = append(carMakers, carMaker)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return carMakers, nil
}

func (m *DBModel) GetModelsByMakerID(makerID int) ([]CarModel, error) {
	rows, err := m.DB.Query("SELECT id, name FROM car_models WHERE car_maker_id=$1 ORDER BY name ASC", makerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var models []CarModel
	for rows.Next() {
		var model CarModel
		err = rows.Scan(&model.ID, &model.Name)
		if err != nil {
			return nil, err
		}
		models = append(models, model)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return models, nil
}

func (m *DBModel) GetMakerByID(makerID int) (CarMaker, error) {
	var maker CarMaker
	row := m.DB.QueryRow("SELECT id, name FROM car_makers WHERE id=$1", makerID)
	err := row.Scan(&maker.ID, &maker.Name)
	if err != nil {
		return maker, err
	}

	return maker, nil
}

func (m *DBModel) GetModelByID(modelID int) (CarModel, error) {
	var model CarModel
	row := m.DB.QueryRow("SELECT id, name FROM car_models WHERE id=$1", modelID)
	err := row.Scan(&model.ID, &model.Name)
	if err != nil {
		return model, err
	}

	return model, nil
}
