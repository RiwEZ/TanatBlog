# Design 
We'll have directory of medias for each blog.

- S3 is the main database.
- We'll simulate folder (1 level only, no nested) by using some prefix e.g. `{prefix}-file.png`

The sync process to know how many folder we have will be
- list all objects in the s3, and saves something like an index for directory 
    ```
    blog1
    blog2
    ```
- when we create a new folder, we update the index
- deleting a folder will not be possible if there's still file in the folder, if we can delete 
  it then update the index

On each folder, we can
- view all medias
- delete a media
- upload new media
