package mongodb

import (
	"errors"

	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"

	"github.com/tfkhdyt/gan-an-wo/api/internal/model"
)

type TokenRepoMongo struct{}

func NewTokenRepoMongo() *TokenRepoMongo {
	return &TokenRepoMongo{}
}

func (t *TokenRepoMongo) VerifyTokenAvailability(token string) error {
	data := new(model.Token)
	if err := mgm.Coll(&model.Token{}).First(bson.M{"token": token}, data); err == nil {
		return errors.New("token has been used")
	}

	return nil
}

func (t *TokenRepoMongo) AddToken(token string) error {
	newToken := model.NewToken(token)
	if err := mgm.Coll(newToken).Create(newToken); err != nil {
		return errors.New("failed to add token")
	}
	return nil
}
