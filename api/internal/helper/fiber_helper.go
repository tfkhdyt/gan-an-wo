package helper

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

func SendJSON(c *websocket.Conn, input any) {
	_ = c.WriteJSON(input)
}

func SendErrorJSON(c *websocket.Conn, message string) {
	SendJSON(c, fiber.Map{
		"success": false,
		"message": message,
	})
}
