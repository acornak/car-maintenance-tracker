package main

import (
	"database/sql"
	"flag"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/acornak/car-maintenance-tracker/models"
	"github.com/acornak/car-maintenance-tracker/writer"
	"github.com/joho/godotenv"
	"go.uber.org/zap"

	_ "github.com/lib/pq"
)

const version = "1.0.0"

type AppStatus struct {
	Status      string `json:"status"`
	Environment string `json:"environment"`
	Version     string `json:"version"`
}

type application struct {
	config     config
	logger     *zap.SugaredLogger
	models     models.Models
	writer     *writer.JsonWriter
	apiVersion string
}

type config struct {
	port          string
	env           string
	dbConn        dbConfig
	allowedOrigin string
	jwtSigningKey []byte
}

type dbConfig struct {
	host     string
	port     string
	user     string
	password string
	dbname   string
	sslmode  string
}

func loadConfigFromEnv(cfg *config) error {
	cfg.port = os.Getenv("PORT")
	cfg.allowedOrigin = os.Getenv("ALLOWED_ORIGIN")
	cfg.dbConn.host = os.Getenv("DB_HOST")
	cfg.dbConn.port = os.Getenv("DB_PORT")
	cfg.dbConn.user = os.Getenv("DB_USER")
	cfg.dbConn.password = os.Getenv("DB_PASS")
	cfg.dbConn.dbname = os.Getenv("DB_NAME")
	cfg.dbConn.sslmode = os.Getenv("SSL_MODE")
	cfg.jwtSigningKey = []byte(os.Getenv("JWT_SECRET"))

	return validateConfig(cfg)
}

func initializeLogger() (*zap.SugaredLogger, error) {
	logger, err := zap.NewProduction()
	if err != nil {
		return nil, err
	}
	defer logger.Sync() // flushes buffer, if any
	return logger.Sugar(), nil
}

func initializeDatabase(cfg *dbConfig, logger *zap.SugaredLogger) (*sql.DB, error) {
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.host, cfg.port, cfg.user, cfg.password, cfg.dbname, cfg.sslmode)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		return nil, err
	}

	logger.Info("Successfully connected to the database")
	return db, nil
}

func newApplication(cfg config, logger *zap.SugaredLogger, db *sql.DB) *application {
	return &application{
		config:     cfg,
		logger:     logger,
		models:     models.NewModels(db),
		writer:     &writer.JsonWriter{},
		apiVersion: "v1",
	}
}

func main() {
	var cfg config
	flag.StringVar(&cfg.env, "ENV", "develop", "Application environment")
	flag.Parse()

	if cfg.env == "develop" {
		err := godotenv.Load(".envrc")
		if err != nil {
			fmt.Println("failed to load env vars:", err)
			os.Exit(1)
		}
	}

	err := loadConfigFromEnv(&cfg)
	if err != nil {
		fmt.Println("failed to load config:", err)
		os.Exit(1)
	}

	logger, err := initializeLogger()
	if err != nil {
		fmt.Println("failed to initialize logger:", err)
		os.Exit(1)
	}
	defer logger.Sync()

	db, err := initializeDatabase(&cfg.dbConn, logger)
	if err != nil {
		logger.Fatal("failed to connect to DB:", err)
	}
	defer db.Close()

	app := newApplication(cfg, logger, db)

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%s", cfg.port),
		Handler:      app.routes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	err = srv.ListenAndServe()
	if err != nil {
		logger.Fatal("Failed to start the server:", err)
	}
}
