package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	_ "github.com/joho/godotenv/autoload"

	"github.com/tfkhdyt/gan-an-wo/api/internal/database"
	"github.com/tfkhdyt/gan-an-wo/api/internal/route"
)

func init() {
	database.ConnectMongoDB()
}

func main() {
	app := fiber.New()

	route.RegisterScoreRoute(app)

	appPort := os.Getenv("APP_PORT")
	if err := app.Listen(":" + appPort); err != nil {
		log.Fatalln("error: failed to listen to port 8000,", err)
	}
}
