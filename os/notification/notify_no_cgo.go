//go:build !cgo

package notification

func Notify(title, message string) error {
	return nil
}
