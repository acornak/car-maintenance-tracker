package models

import (
	"database/sql"
	"errors"
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

type DBModel struct {
	DB *sql.DB
}

type User struct {
	ID        int    `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Nickname  string `json:"nickname"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

func (m *DBModel) Insert(user User) error {
	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 12)
	if err != nil {
		return err
	}

	// Check if the email exists
	var dummy int
	row := m.DB.QueryRow("SELECT 1 FROM users WHERE email=$1", user.Email)
	err = row.Scan(&dummy)
	if err != sql.ErrNoRows {
		return fmt.Errorf("a user with the email '%s' already exists", user.Email)
	}

	// Check if the nickname exists
	row = m.DB.QueryRow("SELECT 1 FROM users WHERE nickname=$1", user.Nickname)
	err = row.Scan(&dummy)
	if err != sql.ErrNoRows {
		return fmt.Errorf("a user with the nickname '%s' already exists", user.Nickname)
	}

	stmt := `INSERT INTO users (first_name, last_name, nickname, email, password) VALUES($1, $2, $3, $4, $5)`

	_, err = m.DB.Exec(stmt, user.FirstName, user.LastName, user.Nickname, user.Email, string(hashedPassword))
	if err != nil {
		return err
	}

	return nil
}

func (m *DBModel) Authenticate(user User) (User, error) {
	row := m.DB.QueryRow("SELECT id, first_name, last_name, nickname, email, password FROM users WHERE email = $1", user.Email)
	err := row.Scan(&user.ID, &user.FirstName, &user.LastName, &user.Nickname)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return User{}, ErrNoRecord
		} else {
			return User{}, err
		}
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(user.Password))
	if err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return User{}, ErrInvalidCredentials
		} else {
			return User{}, err
		}
	}

	return user, nil
}

var (
	ErrNoRecord           = errors.New("models: no matching record found")
	ErrInvalidCredentials = errors.New("models: invalid credentials")
)