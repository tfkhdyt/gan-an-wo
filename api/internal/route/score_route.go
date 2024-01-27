package route

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"

	"github.com/tfkhdyt/gan-an-wo/api/internal/controller"
)

func RegisterScoreRoute(app *fiber.App) {
	scoreRoute := app.Group("/scores")
	scoreController := controller.NewScoreController()

	scoreRoute.Get("/list", websocket.New(scoreController.List))
	scoreRoute.Get("/submit", websocket.New(scoreController.Submit))
}
