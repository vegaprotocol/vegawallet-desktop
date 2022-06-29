//go:build !windows
// +build !windows

package backend

func toZapLogPath(p string) string {
	return p
}
