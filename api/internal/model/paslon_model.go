package model

import "github.com/kamva/mgm/v3"

type Paslon struct {
	mgm.DefaultModel `       bson:",inline"`
	ID               int    `bson:"id"      json:"id"`
	Name             string `bson:"name"    json:"name"`
	Score            uint   `bson:"score"   json:"score"`
}

func NewPaslon(id int, name string, score uint) *Paslon {
	return &Paslon{
		ID:    id,
		Name:  name,
		Score: score,
	}
}

type Paslons []Paslon

func (s Paslons) Len() int {
	return len(s)
}

func (s Paslons) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}

func (s Paslons) Less(i, j int) bool {
	// Sort in descending order based on the "Score" field
	return s[i].Score > s[j].Score
}
