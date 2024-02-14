package main

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/go-co-op/gocron/v2"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	_ "github.com/joho/godotenv/autoload"
	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"

	"github.com/tfkhdyt/gan-an-wo/api/internal/database"
	"github.com/tfkhdyt/gan-an-wo/api/internal/model"
	"github.com/tfkhdyt/gan-an-wo/api/internal/route"
)

func init() {
	database.ConnectMongoDB()
}

func main() {
	s, err := gocron.NewScheduler()
	if err != nil {
		panic(err)
	}

	if _, err := s.NewJob(gocron.DurationJob(1*time.Hour), gocron.NewTask(func() {
		if _, err2 := mgm.Coll(&model.Token{}).DeleteMany(context.Background(), bson.M{}); err != nil {
			panic(err2)
		}
	})); err != nil {
		panic(err)
	}
	s.Start()

	app := fiber.New()
	app.Use(cors.New())

	route.RegisterScoreRoute(app)

	appPort := os.Getenv("APP_PORT")
	if err := app.Listen(":" + appPort); err != nil {
		log.Fatalf("error: failed to listen to port %v. %v\n", appPort, err)
	}
}
