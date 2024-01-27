package main

import (
	"context"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	_ "github.com/joho/godotenv/autoload"
	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Paslon struct {
	mgm.DefaultModel `bson:",inline"`
	ID               int    `json:"id" bson:"id"`
	Name             string `json:"name" bson:"name"`
	Score            uint   `json:"score" bson:"score"`
}

func NewPaslon(id int, name string, score uint) *Paslon {
	return &Paslon{
		ID:    id,
		Name:  name,
		Score: score,
	}
}

func init() {
	if err := mgm.SetDefaultConfig(nil, "gan-an-wo", options.Client().ApplyURI(os.Getenv("MONGODB_URL"))); err != nil {
		log.Fatalln("error: failed to connect to database,", err)
	}

	unique := true
	indexModel := mongo.IndexModel{
		Keys: bson.D{{"id", 1}}, //nolint:all
		Options: &options.IndexOptions{
			Unique: &unique,
		},
	}

	if _, err := mgm.Coll(&Paslon{}).Indexes().CreateOne(context.Background(), indexModel); err != nil {
		log.Fatalln("error: failed to create id index,", err)
	}

	amin := &Paslon{}
	if err := mgm.Coll(amin).First(bson.M{"id": 1}, amin); err != nil {
		newAmin := NewPaslon(1, "Anies - Muhaimin", 0)
		if err := mgm.Coll(newAmin).Create(newAmin); err != nil {
			log.Fatalln("error: failed to seed anies - muhaimin,", err)
		}
	}

	prabowoGibran := &Paslon{}
	if err := mgm.Coll(prabowoGibran).First(bson.M{"id": 2}, prabowoGibran); err != nil {
		newPrabowoGibran := NewPaslon(2, "Prabowo - Gibran", 0)
		if err := mgm.Coll(newPrabowoGibran).Create(newPrabowoGibran); err != nil {
			log.Fatalln("error: failed to seed prabowo - gibran,", err)
		}
	}

	ganjarMahfud := &Paslon{}
	if err := mgm.Coll(ganjarMahfud).First(bson.M{"id": 3}, ganjarMahfud); err != nil {
		newGanjarMahfud := NewPaslon(3, "Ganjar - Mahfud", 0)
		if err := mgm.Coll(newGanjarMahfud).Create(newGanjarMahfud); err != nil {
			log.Fatalln("error: failed to seed ganjar - mahfud,", err)
		}
	}
}

func main() {
	app := fiber.New()

	app.Get("/get-scores", websocket.New(func(c *websocket.Conn) {
		for {
			scores := []Paslon{}
			if err := mgm.Coll(&Paslon{}).SimpleFind(&scores, bson.M{}); err != nil {
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
	}))

	app.Get("/post-scores", websocket.New(func(c *websocket.Conn) {
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
			selectedPaslon := &Paslon{}
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
	}))

	if err := app.Listen(":8080"); err != nil {
		log.Fatalln("error: failed to listen to port 8000,", err)
	}
}
