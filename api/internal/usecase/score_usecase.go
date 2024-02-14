package usecase

import (
	"errors"
	"fmt"
	"strconv"

	"github.com/tfkhdyt/gan-an-wo/api/internal/dto"
	"github.com/tfkhdyt/gan-an-wo/api/internal/helper"
	"github.com/tfkhdyt/gan-an-wo/api/internal/repository"
)

type ScoreUsecase struct {
	userRepo  repository.ScoreRepo
	tokenRepo repository.TokenRepo
}

func NewScoreUsecase(
	userRepo repository.ScoreRepo,
	tokenRepo repository.TokenRepo,
) *ScoreUsecase {
	return &ScoreUsecase{userRepo, tokenRepo}
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
	if err := s.tokenRepo.VerifyTokenAvailability(payload); err != nil {
		fmt.Println(err)
		return nil, err
	}

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

	if err := s.tokenRepo.AddToken(payload); err != nil {
		return nil, err
	}

	response := &dto.SubmitScoreResponse{
		Success: true,
		Message: "submit success",
	}

	return response, nil
}
