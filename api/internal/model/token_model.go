package model

import "github.com/kamva/mgm/v3"

type Token struct {
	mgm.DefaultModel `bson:",inline"`
	Token            string `json:"token" bson:"token"`
}

func NewToken(token string) *Token {
	return &Token{Token: token}
}
