package main

import (
	"database/sql"
	"flag"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/acornak/car-maintenance-tracker/models"
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
	config config
	logger *zap.SugaredLogger
	models models.Models
}

type config struct {
	port   string
	env    string
	dbConn struct {
		host     string
		port     string
		user     string
		password string
		dbname   string
		sslmode  string
	}
	allowedOrigin string
}

var sugar *zap.SugaredLogger

func init() {
	// Initialize the logger
	logger, _ := zap.NewProduction()
	defer logger.Sync() // flushes buffer, if any
	sugar = logger.Sugar()
}

func main() {
	var cfg config

	flag.StringVar(&cfg.env, "ENV", "develop", "Application environment")
	flag.Parse()

	if cfg.env == "develop" {
		err := godotenv.Load(".envrc")
		if err != nil {
			sugar.Fatal("failed to load env vars:", err)
		}
	}

	cfg.port = os.Getenv("PORT")
	cfg.allowedOrigin = os.Getenv("ALLOWED_ORIGIN")
	cfg.dbConn.host = os.Getenv("DB_HOST")
	cfg.dbConn.port = os.Getenv("DB_PORT")
	cfg.dbConn.user = os.Getenv("DB_USER")
	cfg.dbConn.password = os.Getenv("DB_PASS")
	cfg.dbConn.dbname = os.Getenv("DB_NAME")
	cfg.dbConn.sslmode = os.Getenv("SSL_MODE")

	// Initialize the database
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.dbConn.host,
		cfg.dbConn.port,
		cfg.dbConn.user,
		cfg.dbConn.password,
		cfg.dbConn.dbname,
		cfg.dbConn.sslmode,
	)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		sugar.Fatal("failed to open a DB connection:", err)
	}

	err = db.Ping()
	if err != nil {
		sugar.Fatal("failed to connect to DB: ", err)
	}
	defer db.Close()
	sugar.Info("Successfully connected to the database")

	app := &application{
		config: cfg,
		logger: sugar,
		models: models.NewModels(db),
	}

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%s", cfg.port),
		Handler:      app.routes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	err = srv.ListenAndServe()

	// Log the error, if any
	if err != nil {
		sugar.Fatal("Failed to start the server: ", err)
	}
}
