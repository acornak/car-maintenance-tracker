package main

import (
	"database/sql"
	"os"
	"reflect"
	"testing"

	"go.uber.org/zap"
)

func TestMain(m *testing.M) {
	// Set up test environment variables
	os.Setenv("PORT", "8080")
	os.Setenv("ALLOWED_ORIGIN", "http://example.com")
	os.Setenv("DB_HOST", "localhost")
	os.Setenv("DB_PORT", "5432")
	os.Setenv("DB_USER", "user")
	os.Setenv("DB_PASS", "password")
	os.Setenv("DB_NAME", "database")
	os.Setenv("SSL_MODE", "disable")
	os.Setenv("JWT_SECRET", "secret")

	// Run the tests
	code := m.Run()

	// Clean up environment variables after the tests
	os.Unsetenv("PORT")
	os.Unsetenv("ALLOWED_ORIGIN")
	os.Unsetenv("DB_HOST")
	os.Unsetenv("DB_PORT")
	os.Unsetenv("DB_USER")
	os.Unsetenv("DB_PASS")
	os.Unsetenv("DB_NAME")
	os.Unsetenv("SSL_MODE")
	os.Unsetenv("JWT_SECRET")

	// Exit with the appropriate exit code
	os.Exit(code)
}

func TestLoadConfigFromEnv(t *testing.T) {
	// Create a config instance to hold the loaded values
	cfg := config{}

	// Call the function to load config from environment variables
	err := loadConfigFromEnv(&cfg)
	if err != nil {
		t.Errorf("Unexpected error loading config: %v", err)
	}

	// Validate the loaded config
	err = validateConfig(&cfg)
	if err != nil {
		t.Errorf("Loaded config is invalid: %v", err)
	}

	// Perform assertions on the loaded config
	if cfg.port != "8080" {
		t.Errorf("Expected port to be '8080', got '%s'", cfg.port)
	}
	if cfg.allowedOrigin != "http://example.com" {
		t.Errorf("Expected allowedOrigin to be 'http://example.com', got '%s'", cfg.allowedOrigin)
	}
	if cfg.dbConn.host != "localhost" {
		t.Errorf("Expected DB_HOST to be 'localhost', got '%s'", cfg.dbConn.host)
	}
	if cfg.dbConn.port != "5432" {
		t.Errorf("Expected DB_PORT to be '5432', got '%s'", cfg.dbConn.port)
	}
	if cfg.dbConn.user != "user" {
		t.Errorf("Expected DB_USER to be 'user', got '%s'", cfg.dbConn.user)
	}
	if cfg.dbConn.password != "password" {
		t.Errorf("Expected DB_PASS to be 'password', got '%s'", cfg.dbConn.password)
	}
	if cfg.dbConn.dbname != "database" {
		t.Errorf("Expected DB_NAME to be 'database', got '%s'", cfg.dbConn.dbname)
	}
	if cfg.dbConn.sslmode != "disable" {
		t.Errorf("Expected SSL_MODE to be 'disable', got '%s'", cfg.dbConn.sslmode)
	}
	if string(cfg.jwtSigningKey) != "secret" {
		t.Errorf("Expected JWT_SECRET to be 'secret', got '%s'", string(cfg.jwtSigningKey))
	}
}

func TestInitializeLogger(t *testing.T) {
	logger, err := initializeLogger()
	if err != nil {
		t.Fatalf("Unexpected error initializing logger: %v", err)
	}
	defer logger.Sync()

	// Assert that the returned logger is not nil
	if logger == nil {
		t.Error("Expected logger instance, but got nil")
	}
}

func TestNewApplication(t *testing.T) {
	// Create a sample config
	cfg := config{
		port: "8080",
		env:  "development",
		dbConn: dbConfig{
			host:     "localhost",
			port:     "5432",
			user:     "user",
			password: "password",
			dbname:   "database",
			sslmode:  "disable",
		},
		allowedOrigin: "http://example.com",
		jwtSigningKey: []byte("secret"),
	}

	// Create a sample logger
	logger := zap.NewExample().Sugar()

	// Create a sample database instance
	db, err := sql.Open("postgres", "dummy_connection_string")
	if err != nil {
		t.Fatalf("Unexpected error creating database instance: %v", err)
	}
	defer db.Close()

	// Call the newApplication function
	app := newApplication(cfg, logger, db)

	// Assert that the returned application instance is not nil
	if app == nil {
		t.Error("Expected application instance, but got nil")
	}

	if app.logger != logger {
		t.Error("Expected logger to be the same instance")
	}

	// Assert that the models field is not nil
	if reflect.ValueOf(app.models).IsZero() {
		t.Error("Expected models instance, but got nil")
	}
}
