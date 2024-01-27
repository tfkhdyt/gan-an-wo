package repository

import "github.com/tfkhdyt/gan-an-wo/api/internal/model"

type ScoreRepo interface {
	List() ([]model.Paslon, error)
	Submit(paslonID int) error
}
