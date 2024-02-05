package helper

import (
	"fmt"
	"os"

	openssl "github.com/Luzifer/go-openssl"
)

var o *openssl.OpenSSL

func init() {
	o = openssl.New()
}

func DecryptAES(ct string) (string, error) {
	dec, err := o.DecryptBytes(os.Getenv("API_SECRET_KEY"), []byte(ct))
	if err != nil {
		return "", fmt.Errorf("failed to decrypt payload, %v", err)
	}

	return string(dec), nil
}
