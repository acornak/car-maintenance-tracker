package main

import (
	"database/sql"
	"flag"
	"fmt"
	"net/http"
	"time"

	"github.com/acornak/car-maintenance-tracker/models"
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
	port   int
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
	jwt           struct {
		secret string
	}
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

	flag.IntVar(&cfg.port, "PORT", 8000, "Server port to listen on")
	flag.StringVar(&cfg.env, "ENV", "develop", "Application environment")
	flag.StringVar(&cfg.allowedOrigin, "ALLOWED_ORIGIN", "http://localhost:3000", "Allowd origin for server CORS policy")
	// flag.StringVar(&cfg.jwt.secret, "JWT_SECRET", generateSecret("secret", "data"), "secret")
	flag.StringVar(&cfg.dbConn.host, "DB_HOST", "localhost", "DB host")
	flag.StringVar(&cfg.dbConn.port, "DB_PORT", "5432", "DB port")
	flag.StringVar(&cfg.dbConn.user, "DB_USER", "user", "DB user")
	flag.StringVar(&cfg.dbConn.password, "DB_PASS", "password", "DB password")
	flag.StringVar(&cfg.dbConn.dbname, "DB_NAME", "car-maintenance-tracker", "DB name")
	flag.StringVar(&cfg.dbConn.sslmode, "SSL_MODE", "disable", "DB sslmode")
	flag.Parse()

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
		Addr:         fmt.Sprintf(":%d", cfg.port),
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
