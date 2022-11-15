//go:build darwin && cgo

package notification

/*
// Compiler flags.
#cgo CFLAGS: -Wall -x objective-c -std=gnu99 -fobjc-arc
// Linker flags.
#cgo LDFLAGS: -framework Foundation

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
