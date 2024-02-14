package repository

type TokenRepo interface {
	AddToken(token string) error
	VerifyTokenAvailability(token string) error
}
