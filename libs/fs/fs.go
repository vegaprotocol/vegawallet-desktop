package fs

import (
	"io/fs"
	"os"
	"path/filepath"
)

func ReadFile(path string) ([]byte, error) {
	dir, fileName := filepath.Split(path)
	return fs.ReadFile(os.DirFS(dir), fileName)
}

func WriteFile(content []byte, fileName string) error {
	f, err := os.Create(fileName)
	if err != nil {
		return err
	}
	defer f.Close()

	err = f.Chmod(0600)
	if err != nil {
		return err
	}

	_, err = f.Write(content)
	if err != nil {
		return err
	}

	return nil
}

func FileExists(path string) (bool, error) {
	fileInfo, err := os.Stat(path)
	if err == nil {
		// fileStat -> is not a directory
		ok := !fileInfo.IsDir()
		return ok, nil
	}
	if os.IsNotExist(err) {
		return false, nil
	}
	return false, err
}
