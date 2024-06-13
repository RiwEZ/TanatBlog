package main

import (
	"context"

	"github.com/a-h/templ"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	views "github.com/RiwEz/TanatBlog/s3-imgur/views"
)

func renderView(c echo.Context, component templ.Component) error {
	c.Response().Header().Set(echo.HeaderContentType, echo.MIMETextHTML)
	return component.Render(c.Request().Context(), c.Response().Writer)
}

func ListObjects(ctx context.Context, client *s3.Client) []string {
	output, err := client.ListObjectsV2(ctx, &s3.ListObjectsV2Input{
		Bucket: aws.String("tanatblog"), // this need to be configurable
	})
	if err != nil {
		panic(err)
	}

	result := []string{}
	for _, object := range output.Contents {
		result = append(result, *object.Key)
	}
	return result
}

func main() {
	// setting up AWS SDK
	ctx := context.Background()
	cfg, err := config.LoadDefaultConfig(
		ctx,
		config.WithSharedConfigFiles([]string{"./config"}),
		config.WithSharedCredentialsFiles([]string{"./credentials"}),
	)
	if err != nil {
		panic(err)
	}
	client := s3.NewFromConfig(cfg)

	e := echo.New()
	e.Use(middleware.Logger())

	component := views.List(ListObjects(ctx, client))
	e.GET("/", func(c echo.Context) error {
		return renderView(c, component)
	})

	e.Logger.Fatal(e.Start(":1212"))
}
