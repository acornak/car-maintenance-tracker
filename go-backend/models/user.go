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

func (m *DBModel) InsertUser(user User) error {
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

func (m *DBModel) AuthenticateUser(user User) (User, error) {
	row := m.DB.QueryRow("SELECT id, first_name, last_name, nickname, email, password FROM users WHERE email = $1", user.Email)
	err := row.Scan(&user.ID, &user.FirstName, &user.LastName, &user.Nickname)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return User{}, errors.New("models: no matching record found")
		} else {
			return User{}, err
		}
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(user.Password))
	if err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return User{}, errors.New("models: invalid credentials")
		} else {
			return User{}, err
		}
	}

	return user, nil
}

func (m *DBModel) GetAllNicknames() ([]string, error) {
	rows, err := m.DB.Query("SELECT nickname FROM users")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var nicknames []string
	for rows.Next() {
		var nickname string
		err = rows.Scan(&nickname)
		if err != nil {
			return nil, err
		}
		nicknames = append(nicknames, nickname)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return nicknames, nil
}

func (m *DBModel) GetAllEmails() ([]string, error) {
	rows, err := m.DB.Query("SELECT email FROM users")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var emails []string
	for rows.Next() {
		var email string
		err = rows.Scan(&email)
		if err != nil {
			return nil, err
		}
		emails = append(emails, email)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return emails, nil
}

func (m *DBModel) GetUserByEmail(email string) (User, error) {
	var user User
	stmt := `SELECT id, first_name, last_name, nickname, email, password FROM users WHERE email = $1`
	err := m.DB.QueryRow(stmt, email).Scan(&user.ID, &user.FirstName, &user.LastName, &user.Nickname, &user.Email, &user.Password)
	if err != nil {
		if err == sql.ErrNoRows {
			return User{}, errors.New("user not found")
		}
		return User{}, err
	}
	return user, nil
}

func (m *DBModel) GetUserByID(id int) (*User, error) {
	stmt := `SELECT id, first_name, last_name, nickname, email, password FROM users WHERE id=$1`

	row := m.DB.QueryRow(stmt, id)

	user := &User{}
	err := row.Scan(&user.ID, &user.FirstName, &user.LastName, &user.Nickname, &user.Email, &user.Password)
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("no such user")
	} else if err != nil {
		return nil, err
	}

	return user, nil
}
