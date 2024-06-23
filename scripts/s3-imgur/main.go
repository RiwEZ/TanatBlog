package main

import (
	"context"
	"fmt"
	"mime/multipart"
	"net/http"
	"strings"

	"github.com/a-h/templ"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/labstack/echo/v4"
	"github.com/spf13/viper"

	"github.com/RiwEz/TanatBlog/s3-imgur/services"
	views "github.com/RiwEz/TanatBlog/s3-imgur/views"
)

func renderView(c echo.Context, code int, component templ.Component) error {
	c.Response().Header().Set(echo.HeaderContentType, echo.MIMETextHTML)
	c.Response().WriteHeader(code)

	return component.Render(c.Request().Context(), c.Response().Writer)
}

func getFolderName(url string) string {
	t := strings.Split(url, "/")
	return t[len(t)-1]
}

func parseAndValidateAddFolder(c echo.Context) (string, *multipart.FileHeader, map[string]string) {
	errs := map[string]string{}

	folderName := c.FormValue("folderName")
	if folderName == "" {
		errs["folderName"] = "Folder name is empty!"
	}

	file, err := c.FormFile("file")
	if err != nil {
		errs["fileInput"] = "You did not upload the file!"
	} else {
		if !services.IsFileNameValid(file.Filename) {
			errs["fileInput"] = "Invalid File Type"
		}
	}

	return folderName, file, errs
}

func main() {
	viper.SetConfigFile(".env")
	viper.AddConfigPath(".")

	if err := viper.ReadInConfig(); err != nil {
		panic(err)
	}

	var S3Bucket = viper.GetString("S3BUCKET")
	var cloudfrontURL = viper.GetString("CLOUDFRONT_URL")

	// setting up AWS SDK
	ctx := context.Background()
	cfg, err := config.LoadDefaultConfig(
		ctx,
		config.WithCredentialsProvider(
			aws.CredentialsProviderFunc(
				func(ctx context.Context) (aws.Credentials, error) {
					return aws.Credentials{
						AccessKeyID:     viper.GetString("AWS_ACCESS_KEY_ID"),
						SecretAccessKey: viper.GetString("AWS_SECRET_ACCESS_KEY"),
						CanExpire:       false,
					}, nil
				},
			)),
		config.WithRegion(viper.GetString("REGION ")),
	)
	if err != nil {
		panic(err)
	}
	client := s3.NewFromConfig(cfg)

	e := echo.New()

	s3Service := services.NewS3Service(client, S3Bucket, cloudfrontURL)
	if err = s3Service.SyncFolders(ctx); err != nil {
		panic(err)
	}

	e.GET("/", func(c echo.Context) error {
		return renderView(c, http.StatusOK, views.Index(s3Service.GetFolders(ctx)))
	})

	e.POST("/folders", func(c echo.Context) error {
		folderName, file, errs := parseAndValidateAddFolder(c)
		if len(errs) > 0 {
			return renderView(c, http.StatusUnprocessableEntity, views.FolderForm(folderName, errs))
		}
		err = s3Service.AddMedia(ctx, folderName, file)
		if err != nil {
			errs["fileInput"] = err.Error()
		}
		if len(errs) > 0 {
			return renderView(c, http.StatusUnprocessableEntity, views.FolderForm(folderName, errs))
		}
		return renderView(c, http.StatusOK, views.FolderFormWithOOB(s3Service.GetFolders(ctx)))
	})

	e.GET("/:folder", func(c echo.Context) error {
		folder := c.Param("folder")
		return renderView(c, http.StatusOK, views.FolderIndex(folder, s3Service.GetMedias(ctx, folder)))
	})

	e.POST("/folders/files", func(c echo.Context) error {
		file, err := c.FormFile("file")
		if err != nil {
			return renderView(c, http.StatusUnprocessableEntity, views.FileForm("Please specify a file"))
		}

		url := c.Request().Header.Get("Hx-Current-Url")
		folderName := getFolderName(url)

		err = s3Service.AddMedia(ctx, folderName, file)
		if err != nil {
			return renderView(c,
				http.StatusUnprocessableEntity,
				views.FileForm(err.Error()))
		}
		return renderView(c, http.StatusOK, views.FileFormWithOOB(s3Service.GetMedias(ctx, folderName)))
	})

	e.DELETE("/folders/files/:fileName", func(c echo.Context) error {
		url := c.Request().Header.Get("Hx-Current-Url")
		folderName := getFolderName(url)

		fileName := c.Param("fileName")
		err := s3Service.DeleteMedia(ctx, folderName, fileName)
		if err != nil {
			return renderView(c, http.StatusInternalServerError, views.Medias(s3Service.GetMedias(ctx, folderName)))
		}

		return renderView(c, http.StatusOK, views.Medias(s3Service.GetMedias(ctx, folderName)))
	})

	fmt.Println("Starting a server at http://localhost:1212")
	e.Logger.Fatal(e.Start(":1212"))
}
