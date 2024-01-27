package database

import (
	"context"
	"log"
	"os"

	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/tfkhdyt/gan-an-wo/api/internal/model"
)

func ConnectMongoDB() {
	dbName := os.Getenv("MONGODB_NAME")
	dbUrl := os.Getenv("MONGODB_URL")

	if err := mgm.SetDefaultConfig(nil, dbName, options.Client().ApplyURI(dbUrl)); err != nil {
		log.Fatalln("error: failed to connect to database,", err)
	}

	createIndex()
	seed()
}

func createIndex() {
	unique := true
	indexModel := mongo.IndexModel{
		Keys: bson.D{{"id", 1}}, //nolint:all
		Options: &options.IndexOptions{
			Unique: &unique,
		},
	}

	if _, err := mgm.Coll(&model.Paslon{}).Indexes().CreateOne(context.Background(), indexModel); err != nil {
		log.Fatalln("error: failed to create id index,", err)
	}
}

func seed() {
	amin := &model.Paslon{}
	if err := mgm.Coll(amin).First(bson.M{"id": 1}, amin); err != nil {
		newAmin := model.NewPaslon(1, "Anies - Muhaimin", 0)
		if err := mgm.Coll(newAmin).Create(newAmin); err != nil {
			log.Fatalln("error: failed to seed anies - muhaimin,", err)
		}
	}

	prabowoGibran := &model.Paslon{}
	if err := mgm.Coll(prabowoGibran).First(bson.M{"id": 2}, prabowoGibran); err != nil {
		newPrabowoGibran := model.NewPaslon(2, "Prabowo - Gibran", 0)
		if err := mgm.Coll(newPrabowoGibran).Create(newPrabowoGibran); err != nil {
			log.Fatalln("error: failed to seed prabowo - gibran,", err)
		}
	}

	ganjarMahfud := &model.Paslon{}
	if err := mgm.Coll(ganjarMahfud).First(bson.M{"id": 3}, ganjarMahfud); err != nil {
		newGanjarMahfud := model.NewPaslon(3, "Ganjar - Mahfud", 0)
		if err := mgm.Coll(newGanjarMahfud).Create(newGanjarMahfud); err != nil {
			log.Fatalln("error: failed to seed ganjar - mahfud,", err)
		}
	}
}
