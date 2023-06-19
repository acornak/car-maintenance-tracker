package models_test

import (
	"testing"

	sqlmock "github.com/DATA-DOG/go-sqlmock"
	"github.com/acornak/car-maintenance-tracker/models"
	"github.com/stretchr/testify/assert"
)

func TestNewModels(t *testing.T) {
	// Open database mock
	db, _, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %s", err)
	}
	defer db.Close()

	testModels := models.NewModels(db)

	assert.NotNil(t, testModels.DB)
}
