package models_test

import (
	"database/sql"
	"errors"
	"testing"

	sqlmock "github.com/DATA-DOG/go-sqlmock"
	"github.com/acornak/car-maintenance-tracker/models"
	"github.com/stretchr/testify/assert"
)

func TestInsertUser_Success(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	mock.ExpectQuery("SELECT 1 FROM users WHERE email=").WithArgs("test@example.com").WillReturnError(sql.ErrNoRows)
	mock.ExpectQuery("SELECT 1 FROM users WHERE nickname=").WithArgs("testuser").WillReturnError(sql.ErrNoRows)

	mock.ExpectExec("INSERT INTO users").WithArgs("John", "Doe", "testuser", "test@example.com", sqlmock.AnyArg()).WillReturnResult(sqlmock.NewResult(1, 1))

	modelsDB := models.NewModels(db)
	user := models.User{
		FirstName: "John",
		LastName:  "Doe",
		Nickname:  "testuser",
		Email:     "test@example.com",
		Password:  "password123",
	}

	err = modelsDB.DB.InsertUser(user)

	assert.NoError(t, err)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestInsertUser_EmailExists(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	mock.ExpectQuery("SELECT 1 FROM users WHERE email=").WithArgs("test@example.com").WillReturnRows(sqlmock.NewRows([]string{"1"}).AddRow(1))

	modelsDB := models.NewModels(db)
	user := models.User{
		FirstName: "John",
		LastName:  "Doe",
		Nickname:  "testuser",
		Email:     "test@example.com",
		Password:  "password123",
	}

	err = modelsDB.DB.InsertUser(user)

	assert.Error(t, err)
	assert.EqualError(t, err, "a user with the email 'test@example.com' already exists")
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestInsertUser_NicknameExists(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	mock.ExpectQuery("SELECT 1 FROM users WHERE email=").WithArgs("test@example.com").WillReturnError(sql.ErrNoRows)
	mock.ExpectQuery("SELECT 1 FROM users WHERE nickname=").WithArgs("testuser").WillReturnRows(sqlmock.NewRows([]string{"1"}).AddRow(1))

	modelsDB := models.NewModels(db)
	user := models.User{
		FirstName: "John",
		LastName:  "Doe",
		Nickname:  "testuser",
		Email:     "test@example.com",
		Password:  "password123",
	}

	err = modelsDB.DB.InsertUser(user)

	assert.Error(t, err)
	assert.EqualError(t, err, "a user with the nickname 'testuser' already exists")
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestCheckNicknameExists_NicknameExists(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	rows := sqlmock.NewRows([]string{"exists"}).AddRow(true)

	mock.ExpectQuery(`SELECT exists \(SELECT 1 FROM users WHERE nickname=\$1\)`).
		WithArgs(sqlmock.AnyArg()).
		WillReturnRows(rows)

	modelsDB := models.NewModels(db)
	exists, err := modelsDB.DB.CheckNicknameExists("testuser")

	assert.NoError(t, err)
	assert.True(t, exists)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestCheckNicknameExists_NicknameDoesNotExist(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	rows := sqlmock.NewRows([]string{"exists"}).AddRow(false)

	mock.ExpectQuery(`SELECT exists \(SELECT 1 FROM users WHERE nickname=\$1\)`).
		WithArgs(sqlmock.AnyArg()).
		WillReturnRows(rows)

	modelsDB := models.NewModels(db)
	exists, err := modelsDB.DB.CheckNicknameExists("testuser")

	assert.NoError(t, err)
	assert.False(t, exists)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestCheckNicknameExists_Error(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	mock.ExpectQuery(`SELECT exists \(SELECT 1 FROM users WHERE nickname=\$1\)`).
		WithArgs(sqlmock.AnyArg()).
		WillReturnError(errors.New("mocked error"))

	modelsDB := models.NewModels(db)
	_, err = modelsDB.DB.CheckNicknameExists("testuser")

	assert.Error(t, err)
	assert.EqualError(t, err, "mocked error")
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestCheckEmailExists_EmailExists(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	rows := sqlmock.NewRows([]string{"exists"}).AddRow(true)

	mock.ExpectQuery(`SELECT exists \(SELECT 1 FROM users WHERE email=\$1\)`).
		WithArgs(sqlmock.AnyArg()).
		WillReturnRows(rows)

	modelsDB := models.NewModels(db)
	exists, err := modelsDB.DB.CheckEmailExists("test@example.com")

	assert.NoError(t, err)
	assert.True(t, exists)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestCheckEmailExists_EmailDoesNotExist(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	rows := sqlmock.NewRows([]string{"exists"}).AddRow(false)

	mock.ExpectQuery(`SELECT exists \(SELECT 1 FROM users WHERE email=\$1\)`).
		WithArgs(sqlmock.AnyArg()).
		WillReturnRows(rows)

	modelsDB := models.NewModels(db)
	exists, err := modelsDB.DB.CheckEmailExists("test@example.com")

	assert.NoError(t, err)
	assert.False(t, exists)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestCheckEmailExists_Error(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	mock.ExpectQuery(`SELECT exists \(SELECT 1 FROM users WHERE email=\$1\)`).
		WithArgs(sqlmock.AnyArg()).
		WillReturnError(errors.New("mocked error"))

	modelsDB := models.NewModels(db)
	_, err = modelsDB.DB.CheckEmailExists("test@example.com")

	assert.Error(t, err)
	assert.EqualError(t, err, "mocked error")
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetUserByEmail_UserExists(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	user := models.User{
		ID:        1,
		FirstName: "John",
		LastName:  "Doe",
		Nickname:  "johndoe",
		Email:     "test@example.com",
		Password:  "password",
	}

	rows := sqlmock.NewRows([]string{"id", "first_name", "last_name", "nickname", "email", "password"}).
		AddRow(user.ID, user.FirstName, user.LastName, user.Nickname, user.Email, user.Password)

	mock.ExpectQuery(`SELECT id, first_name, last_name, nickname, email, password FROM users WHERE email = \$1`).
		WithArgs("test@example.com").
		WillReturnRows(rows)

	modelsDB := models.NewModels(db)
	result, err := modelsDB.DB.GetUserByEmail("test@example.com")

	assert.NoError(t, err)
	assert.Equal(t, user, result)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetUserByEmail_UserNotFound(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	mock.ExpectQuery(`SELECT id, first_name, last_name, nickname, email, password FROM users WHERE email = \$1`).
		WithArgs("test@example.com").
		WillReturnError(sql.ErrNoRows)

	modelsDB := models.NewModels(db)
	_, err = modelsDB.DB.GetUserByEmail("test@example.com")

	assert.Error(t, err)
	assert.EqualError(t, err, "user not found")
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetUserByEmail_Error(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	mock.ExpectQuery(`SELECT id, first_name, last_name, nickname, email, password FROM users WHERE email = \$1`).
		WithArgs("test@example.com").
		WillReturnError(errors.New("mocked error"))

	modelsDB := models.NewModels(db)
	_, err = modelsDB.DB.GetUserByEmail("test@example.com")

	assert.Error(t, err)
	assert.EqualError(t, err, "mocked error")
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetUserByID_UserExists(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	user := &models.User{
		ID:        1,
		FirstName: "John",
		LastName:  "Doe",
		Nickname:  "johndoe",
		Email:     "test@example.com",
		Password:  "password",
	}

	rows := sqlmock.NewRows([]string{"id", "first_name", "last_name", "nickname", "email", "password"}).
		AddRow(user.ID, user.FirstName, user.LastName, user.Nickname, user.Email, user.Password)

	mock.ExpectQuery(`SELECT id, first_name, last_name, nickname, email, password FROM users WHERE id=\$1`).
		WithArgs(1).
		WillReturnRows(rows)

	modelsDB := models.NewModels(db)
	result, err := modelsDB.DB.GetUserByID(1)

	assert.NoError(t, err)
	assert.Equal(t, user, result)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetUserByID_UserNotFound(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	mock.ExpectQuery(`SELECT id, first_name, last_name, nickname, email, password FROM users WHERE id=\$1`).
		WithArgs(1).
		WillReturnError(sql.ErrNoRows)

	modelsDB := models.NewModels(db)
	result, err := modelsDB.DB.GetUserByID(1)

	assert.Error(t, err)
	assert.EqualError(t, err, "no such user")
	assert.Nil(t, result)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetUserByID_Error(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	mock.ExpectQuery(`SELECT id, first_name, last_name, nickname, email, password FROM users WHERE id=\$1`).
		WithArgs(1).
		WillReturnError(errors.New("mocked error"))

	modelsDB := models.NewModels(db)
	result, err := modelsDB.DB.GetUserByID(1)

	assert.Error(t, err)
	assert.EqualError(t, err, "mocked error")
	assert.Nil(t, result)
	assert.NoError(t, mock.ExpectationsWereMet())
}
