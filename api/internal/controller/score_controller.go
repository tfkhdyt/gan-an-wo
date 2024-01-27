package controller

import (
	"log"
	"strconv"
	"time"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"

	"github.com/tfkhdyt/gan-an-wo/api/internal/model"
)

type ScoreController struct{}

func NewScoreController() *ScoreController {
	return &ScoreController{}
}

func (s *ScoreController) Submit(c *websocket.Conn) {
	for {
		scores := []model.Paslon{}
		if err := mgm.Coll(&model.Paslon{}).SimpleFind(&scores, bson.M{}); err != nil {
			if err := c.WriteJSON(fiber.Map{
				"success": false,
				"message": "failed to get scores from db",
			}); err != nil {
				log.Println("error: failed to write json,", err)
				break
			}
		}

		if err := c.WriteJSON(fiber.Map{
			"success": true,
			"message": "scores fetched successfully",
			"data":    scores,
		}); err != nil {
			log.Println("error: failed to write json,", err)
			break
		}

		time.Sleep(1 * time.Second)
	}
}

func (s *ScoreController) List(c *websocket.Conn) {
	for {
		// read input
		_, msg, err := c.ReadMessage()
		if err != nil {
			if err := c.WriteJSON(fiber.Map{
				"success": false,
				"message": "failed to read input",
			}); err != nil {
				log.Println("error: failed to write json,", err)
				break
			}
			break
		}

		// convert input to integer
		paslonInput, err := strconv.Atoi(string(msg))
		if err != nil {
			if err := c.WriteJSON(fiber.Map{
				"success": false,
				"message": "input should be in integer",
			}); err != nil {
				log.Println("error: failed to write json,", err)
				break
			}
			break
		}

		// find paslon
		selectedPaslon := &model.Paslon{}
		if err := mgm.Coll(selectedPaslon).First(bson.M{"id": paslonInput}, selectedPaslon); err != nil {
			if err := c.WriteJSON(fiber.Map{
				"success": false,
				"message": "paslon is not found",
			}); err != nil {
				log.Println("error: failed to write json,", err)
				break
			}
			break
		}

		// update score
		selectedPaslon.Score++
		if err := mgm.Coll(selectedPaslon).Update(selectedPaslon); err != nil {
			if err := c.WriteJSON(fiber.Map{
				"success": false,
				"message": "failed to update score",
			}); err != nil {
				log.Println("error: failed to write json,", err)
				break
			}
			break
		}

		// send success message
		if err := c.WriteJSON(fiber.Map{
			"success": true,
			"message": "vote success",
		}); err != nil {
			log.Println("error: failed to write json,", err)
			break
		}
	}
}
