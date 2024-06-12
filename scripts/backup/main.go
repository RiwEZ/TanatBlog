package main

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"regexp"
	"strings"
	"time"
)

type Pair[T, U any] struct {
	Fst T
	Snd U
}

type Media = Pair[string, []byte]

func GetFileName(url string) (string, error) {
	for i := len(url) - 1; i >= 0; i-- {
		if url[i] == '/' {
			return url[i+1:], nil
		}
	}

	return "", errors.New("The URL is not valid")
}

func FindUrls(content []byte, pattern string) []string {
	urls := []string{}

	r, err := regexp.Compile(pattern)
	if err != nil {
		panic(err)
	}
	for _, match := range r.FindAllSubmatch(content, -1) {
		// we have only one capture group, get it at index 1
		urls = append(urls, string(match[1]))
	}

	return urls
}

func GetMediasUrl(content []byte) []string {
	urls := []string{}

	urls = append(urls, FindUrls(content, `<img\s+[^>]*src="([^"]+)"`)...)
	urls = append(urls, FindUrls(content, `<source\s+[^>]*src="([^"]+)"`)...)
	urls = append(urls, FindUrls(content, `!\[.*?\]\(([^\)]+)`)...)

	return urls
}

func DownloadMedias(urls []string) ([]Media, error) {
	results := []Pair[string, []byte]{}
  client := &http.Client{}

	for _, url := range urls {
		filename, err := GetFileName(url)
		if err != nil {
			return nil, err
		}

		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			return nil, err
		}
    req.Header.Set("Connection", "keep-alive")
    req.Header.Set("User-Agent", "TanatBlog/0.0.1")

    resp, err := client.Do(req)
    if err != nil {
      return nil, err
    }

		bytes, err := io.ReadAll(resp.Body)
    if err != nil {
      return nil, err
    }
		results = append(results, Media{filename, bytes})

    // sleep for 100 ms, if we recently used imgur 
    if strings.Contains(url, "imgur") {
      time.Sleep(100 * time.Millisecond)
    }
	}

	return results, nil
}

func WriteMedias(dir string, medias []Media) error {
	if _, err := os.Stat(dir); err != nil {
		if os.IsNotExist(err) {
			err := os.MkdirAll(dir, 0777)
			if err != nil {
				return err
			}
		} else {
			return err
		}
	}

	for _, v := range medias {
		err := os.WriteFile(dir+v.Fst, v.Snd, 0666)
		if err != nil {
			return err
		}
	}
	return nil
}

func main() {
	blogsPath := "../../src/content/blog/"

	dir, err := os.Open(blogsPath)
	if err != nil {
		panic(err)
	}
	files, err := dir.Readdirnames(-1)
	if err != nil {
		panic(err)
	}

  currTime := time.Now().Format("2006-01-02T15:04:05")
	backupsPath := currTime + "-medias/"
	for _, file := range files {
		fmt.Printf("backuping for" + file + ": ")

		content, err := os.ReadFile(blogsPath + file)
		if err != nil {
			fmt.Println(err)
		}

		urls := GetMediasUrl(content)
		medias, err := DownloadMedias(urls)
		if err != nil {
			fmt.Println(err)
		}
		err = WriteMedias(backupsPath+file+"/", medias)
		if err != nil {
			fmt.Println(err)
		}

		fmt.Printf("success\n")
	}
}
