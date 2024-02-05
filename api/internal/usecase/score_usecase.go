package usecase

import (
	"errors"
	"strconv"

	"github.com/tfkhdyt/gan-an-wo/api/internal/dto"
	"github.com/tfkhdyt/gan-an-wo/api/internal/helper"
	"github.com/tfkhdyt/gan-an-wo/api/internal/repository"
)

type ScoreUsecase struct {
	userRepo repository.ScoreRepo
}

func NewScoreUsecase(userRepo repository.ScoreRepo) *ScoreUsecase {
	return &ScoreUsecase{userRepo}
}

func (s *ScoreUsecase) List() (*dto.ListScoreResponse, error) {
	paslon, err := s.userRepo.List()
	if err != nil {
		return nil, err
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

func (s *ScoreUsecase) Submit(
	payload string,
) (*dto.SubmitScoreResponse, error) {
	paslonStr, err := helper.DecryptAES(payload)
	if err != nil {
		return nil, err
	}

	paslon, err := strconv.Atoi(paslonStr)
	if err != nil {
		return nil, errors.New("failed to convert payload to int")
	}

	if err := s.userRepo.Submit(paslon); err != nil {
		return nil, err
	}

	response := &dto.SubmitScoreResponse{
		Success: true,
		Message: "submit success",
	}

	return response, nil
}
