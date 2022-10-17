//go:build darwin

package os

// The library we use to emit OS specific notification, it not a suitable solution
// on macOS as it uses osascript that doesn't support customization, and opens
// AppleScript software when the notifications are clicked instead of the emitter.

func Notify(_, _ string) error {
	// Not yet supported.
	return nil
}
