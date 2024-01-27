package route

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"

	"github.com/tfkhdyt/gan-an-wo/api/internal/controller"
	"github.com/tfkhdyt/gan-an-wo/api/internal/usecase"
)

func RegisterScoreRoute(app *fiber.App) {
	scoreRoute := app.Group("/scores")

	scoreUsecase := usecase.NewScoreUsecase()
	scoreController := controller.NewScoreController(scoreUsecase)

	scoreRoute.Get("/list", websocket.New(scoreController.List))
	scoreRoute.Get("/submit", websocket.New(scoreController.Submit))
}
