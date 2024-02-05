package controller

import (
	"time"

	"github.com/gofiber/contrib/websocket"

	"github.com/tfkhdyt/gan-an-wo/api/internal/helper"
	"github.com/tfkhdyt/gan-an-wo/api/internal/usecase"
)

type ScoreController struct {
	scoreUsecase *usecase.ScoreUsecase
}

func NewScoreController(scoreUsecase *usecase.ScoreUsecase) *ScoreController {
	return &ScoreController{scoreUsecase}
}

func (s *ScoreController) List(c *websocket.Conn) {
	for {
		response, err := s.scoreUsecase.List()
		if err != nil {
			helper.SendErrorJSON(c, err.Error())
			break
		}

		helper.SendJSON(c, response)

		time.Sleep(1 * time.Second)
	}
}

func (s *ScoreController) Submit(c *websocket.Conn) {
	for {
		_, msg, err := c.ReadMessage()
		if err != nil {
			helper.SendErrorJSON(c, err.Error())
			break
		}

		response, err := s.scoreUsecase.Submit(string(msg))
		if err != nil {
			helper.SendErrorJSON(c, err.Error())
		}

		helper.SendJSON(c, response)
	}
}
