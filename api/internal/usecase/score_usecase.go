package usecase

import (
	"fmt"

	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"

	"github.com/tfkhdyt/gan-an-wo/api/internal/dto"
	"github.com/tfkhdyt/gan-an-wo/api/internal/model"
)

type ScoreUsecase struct{}

func NewScoreUsecase() *ScoreUsecase {
	return &ScoreUsecase{}
}

func (s *ScoreUsecase) List() (*dto.ListScoreResponse, error) {
	paslon := []model.Paslon{}
	if err := mgm.Coll(&model.Paslon{}).SimpleFind(&paslon, bson.M{}); err != nil {
		return nil, fmt.Errorf("failed to get scores from db. %v", err)
	}

	response := &dto.ListScoreResponse{}
	response.Success = true
	for _, score := range paslon {
		response.Data = append(response.Data, dto.ScoreData{
			ID:    score.ID,
			Name:  score.Name,
			Score: score.Score,
		})
	}

	return response, nil
}

func (s *ScoreUsecase) Submit(paslon int) (*dto.SubmitScoreResponse, error) {
	selectedPaslon := &model.Paslon{}
	if err := mgm.Coll(selectedPaslon).First(bson.M{"id": paslon}, selectedPaslon); err != nil {
		return nil, fmt.Errorf("failed to find paslon")
	}

	selectedPaslon.Score++
	if err := mgm.Coll(selectedPaslon).Update(selectedPaslon); err != nil {
		return nil, fmt.Errorf("failed to update score")
	}

	response := &dto.SubmitScoreResponse{
		Success: true,
		Message: "submit success",
	}

	return response, nil
}
