package models

import (
	"database/sql"
)

// wrapper for the database
type Models struct {
	DB DBModel
}

// models with db pool
func NewModels(db *sql.DB) Models {
	return Models{
		DB: DBModel{DB: db},
	}
}
