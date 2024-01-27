package dto

type ScoreData struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Score uint   `json:"score"`
}

type ListScoreResponse struct {
	Success bool        `json:"success"`
	Data    []ScoreData `json:"data"`
}

type SubmitScoreResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}
