//go:build darwin

package notification

/*
#cgo CFLAGS: -Wall -x objective-c
#cgo LDFLAGS: -framework Foundation -framework UserNotifications
#import "notify_darwin.h"
*/
import "C"
import "unsafe"

func Notify(title, message string) error {
	cTitle := C.CString(title)
	cBody := C.CString(message)

	defer C.free(unsafe.Pointer(cTitle))
	defer C.free(unsafe.Pointer(cBody))

	C.Send(cTitle, cBody)

	return nil
}

func Init() error {
	C.Init()
	return nil
}
