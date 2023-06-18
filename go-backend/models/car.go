package models

type Car struct {
	ID          int    `json:"id"`
	UserId      int    `json:"user_id"`
	Brand       string `json:"brand"`
	Model       string `json:"model"`
	Year        int    `json:"year,string,omitempty"`
	Color       string `json:"color,omitempty"`
	Price       int    `json:"price,string,omitempty"`
	Image       string `json:"image"`
	Description string `json:"description,omitempty"`
	CreatedAt   string `json:"created_at"`
}

func (m *DBModel) InsertCar(car Car) error {
	stmt := `INSERT INTO cars (user_id, brand, model, year, color, price, image, description) VALUES($1, $2, $3, $4, $5, $6, $7, $8)`

	_, err := m.DB.Exec(stmt, car.UserId, car.Brand, car.Model, car.Year, car.Color, car.Price, car.Image, car.Description)
	if err != nil {
		return err
	}

	return nil
}

func (m *DBModel) RemoveCar(carId int) error {
	stmt := `DELETE FROM cars WHERE id=$1`

	_, err := m.DB.Exec(stmt, carId)
	if err != nil {
		return err
	}

	return nil
}

func (m *DBModel) GetCarsByUserID(userId int) ([]Car, error) {
	stmt := `SELECT id, user_id, brand, model, year, color, price, image, description, created_at FROM cars WHERE user_id=$1`

	rows, err := m.DB.Query(stmt, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var cars []Car

	for rows.Next() {
		var car Car

		err := rows.Scan(&car.ID, &car.UserId, &car.Brand, &car.Model, &car.Year, &car.Color, &car.Price, &car.Image, &car.Description, &car.CreatedAt)
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
