//go:build !windows

package logger

func toZapLogPath(p string) string {
	return p
}
