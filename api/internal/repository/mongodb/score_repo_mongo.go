package mongodb

import (
	"fmt"

	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"

	"github.com/tfkhdyt/gan-an-wo/api/internal/model"
)

type ScoreRepoMongo struct{}

func NewScoreRepoMong() *ScoreRepoMongo {
	return &ScoreRepoMongo{}
}

func (s *ScoreRepoMongo) List() ([]model.Paslon, error) {
	paslon := []model.Paslon{}
	if err := mgm.Coll(&model.Paslon{}).SimpleFind(&paslon, bson.M{}); err != nil {
		return nil, fmt.Errorf("failed to get scores from db. %v", err)
	}

	return paslon, nil
}

func (s *ScoreRepoMongo) findOne(paslonID int) (*model.Paslon, error) {
	selectedPaslon := &model.Paslon{}
	if err := mgm.Coll(selectedPaslon).First(bson.M{"id": paslonID}, selectedPaslon); err != nil {
		return nil, fmt.Errorf("failed to find paslon")
	}

	return selectedPaslon, nil
}

func (s *ScoreRepoMongo) Submit(paslonID int) error {
	paslon, err := s.findOne(paslonID)
	if err != nil {
		return err
	}

	paslon.Score++
	if err := mgm.Coll(paslon).Update(paslon); err != nil {
		return fmt.Errorf("failed to update score")
	}

	return nil
}
