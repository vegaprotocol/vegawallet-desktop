package logger

import (
	"fmt"
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func New(level, output string) (*zap.Logger, error) {
	zapFilePath := toZapLogPath(output)
	cfg := zap.Config{
		Level:    zap.NewAtomicLevelAt(zapcore.InfoLevel),
		Encoding: "json",
		EncoderConfig: zapcore.EncoderConfig{
			MessageKey:     "message",
			LevelKey:       "level",
			TimeKey:        "@timestamp",
			NameKey:        "logger",
			CallerKey:      "caller",
			StacktraceKey:  "stacktrace",
			LineEnding:     "\n",
			EncodeLevel:    zapcore.LowercaseLevelEncoder,
			EncodeTime:     zapcore.ISO8601TimeEncoder,
			EncodeDuration: zapcore.StringDurationEncoder,
			EncodeCaller:   zapcore.ShortCallerEncoder,
			EncodeName:     zapcore.FullNameEncoder,
		},
		OutputPaths:       []string{zapFilePath},
		ErrorOutputPaths:  []string{zapFilePath},
		DisableStacktrace: true,
	}

	l, err := getLoggerLevel(level)
	if err != nil {
		return nil, err
	}

	cfg.Level = zap.NewAtomicLevelAt(*l)

	log, err := cfg.Build()
	if err != nil {
		return nil, fmt.Errorf("couldn't create logger: %w", err)
	}
	return log, nil
}

func IsSupportedLevel(level string) bool {
	for _, supported := range []string{
		zapcore.DebugLevel.String(),
		zapcore.InfoLevel.String(),
		zapcore.WarnLevel.String(),
		zapcore.ErrorLevel.String(),
	} {
		if level == supported {
			return true
		}
	}
	return false
}

func Sync(logger *zap.Logger) func() {
	return func() {
		err := logger.Sync()
		if err != nil {
			// Try to report any flushing errors on stderr
			if _, err := fmt.Fprintf(os.Stderr, "couldn't flush logger: %v", err); err != nil {
				// This is the ultimate reporting, as we can't do anything else.
				fmt.Printf("couldn't flush logger: %v", err)
			}
		}
	}
}

func getLoggerLevel(level string) (*zapcore.Level, error) {
	if !IsSupportedLevel(level) {
		return nil, fmt.Errorf("unsupported logger level %s", level)
	}

	l := new(zapcore.Level)

	err := l.UnmarshalText([]byte(level))
	if err != nil {
		return nil, fmt.Errorf("couldn't parse logger level: %w", err)
	}

	return l, nil
}
