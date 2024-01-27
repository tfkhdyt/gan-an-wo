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
