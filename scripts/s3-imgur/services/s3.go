package services

import (
	"context"
	"errors"
	"mime/multipart"
	"regexp"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

const FOLDER_SEPARATOR = "--"

var (
	ErrInvalidFileType  = errors.New("Invalid File Type")
	ErrFileAlreadyExist = errors.New("File Already Exist")
)

type FolderMetadata struct {
	TotalSize    int64
	LastModified time.Time
}

type S3Service struct {
	folders         map[string][]string
	foldersMetadata map[string]*FolderMetadata
	metadataDirty   bool
	s3Client        *s3.Client
	bucket          string
	cfURL           string
}

func getPrefix(key string) (string, error) {
	if len(key) == 0 {
		return "", errors.New("empty key")
	}
	idx := strings.Index(key, FOLDER_SEPARATOR)
	if idx < 1 {
		return "", errors.New("invalid key")
	}

	return key[:idx], nil
}

func NewS3Service(s3Client *s3.Client, bucket, cfURL string) S3Service {
	return S3Service{
		folders:         map[string][]string{},
		foldersMetadata: map[string]*FolderMetadata{},
		s3Client:        s3Client,
		bucket:          bucket,
		cfURL:           cfURL,
	}
}

func (s *S3Service) SyncFolders(ctx context.Context) error {
	output, err := s.s3Client.ListObjectsV2(ctx, &s3.ListObjectsV2Input{
		Bucket: aws.String(s.bucket),
	})
	if err != nil {
		return err
	}

	folders := map[string][]string{}
	foldersMetadata := map[string]*FolderMetadata{}
	for _, object := range output.Contents {
		folderName, err := getPrefix(*object.Key)
		if err != nil {
			continue
		}
		fileURL := s.cfURL + *object.Key

		_, ok := folders[folderName]
		if !ok {
			folders[folderName] = []string{fileURL}
		} else {
			folders[folderName] = append(folders[folderName], fileURL)
		}

		folderMetadataEntry, ok := foldersMetadata[folderName]
		if !ok {
			foldersMetadata[folderName] = &FolderMetadata{
				TotalSize:    *object.Size,
				LastModified: *object.LastModified,
			}
		} else {
			folderMetadataEntry.TotalSize += *object.Size
			// use most recent last modified
			objectLastModified := *object.LastModified
			if objectLastModified.Compare(folderMetadataEntry.LastModified) >= 1 {
				folderMetadataEntry.LastModified = objectLastModified
			}
		}
	}

	s.folders = folders
	s.foldersMetadata = foldersMetadata
	return nil
}

func (s *S3Service) GetFolders(ctx context.Context) map[string]*FolderMetadata {
	if s.metadataDirty {
		err := s.SyncFolders(ctx)
		if err != nil {
			panic(err)
		}
		s.metadataDirty = false
	}

	return s.foldersMetadata
}

func IsFileNameValid(fileName string) bool {
	pattern := `(?i)\.(mp4|png|jpg|gif)$`
	re := regexp.MustCompile(pattern)
	return re.MatchString(fileName)
}

func IsFileAlreadyExist(files []string, file string) bool {
	for _, f := range files {
		if f == file {
			return true
		}
	}
	return false
}

// folder can't be empty
func (s *S3Service) AddMedia(ctx context.Context, folderName string, file *multipart.FileHeader) error {
	fileName := file.Filename

	if !IsFileNameValid(fileName) {
		return ErrInvalidFileType
	}

	newFileName := folderName + FOLDER_SEPARATOR + fileName
	fileURL := s.cfURL + newFileName
	if IsFileAlreadyExist(s.folders[folderName], fileURL) {
		return ErrFileAlreadyExist
	}

	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	_, err = s.s3Client.PutObject(ctx, &s3.PutObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(newFileName),
		Body:   src,
	})
	if err != nil {
		return err
	}

	entry, ok := s.folders[folderName]
	if !ok {
		s.folders[folderName] = []string{fileURL}
	} else {
		s.folders[folderName] = append(entry, fileURL)
	}
	s.metadataDirty = true
	return nil
}

func (s *S3Service) GetMedias(ctx context.Context, folderName string) []string {
  entry, ok := s.folders[folderName]
	if ok {
		return entry
	}

	// fallback
	err := s.SyncFolders(ctx)
	if err != nil {
		panic(err)
	}
	return s.folders[folderName]
}

func (s *S3Service) DeleteMedia(ctx context.Context, folderName, fileName string) error {
	_, err := s.s3Client.DeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(fileName),
	})
	if err != nil {
		return err
	}
	f, ok := s.folders[folderName]
  if !ok {
    panic("folder not found")
  }

	var idx int
	for i, fileURL := range f {
		if strings.HasSuffix(fileURL, fileName) {
			idx = i
			break
		}
	}
	s.folders[folderName] = append(f[:idx], f[idx+1:]...)
	if len(s.folders[folderName]) == 0 {
		delete(s.folders, folderName)
		delete(s.foldersMetadata, folderName)
	}
	s.metadataDirty = true
	return nil
}
