# SocialMediaAPI

A RESTful API expanded to include additional routes and features that are common in this type of API.
It is for managing users, posts, and comments.

# Objectives
- Add additional features to [an existing RESTful Express API](https://codesandbox.io/p/sandbox/express-building-a-restful-api-9-hg34yn).
- Refactor existing code for efficiency, organization, and/or performance.

## Features

- Manages user data (creation, retrieval, updating, deletion).
- Manages user posts (creation, retrieval, updating, deletion).
- Allows retrieval of posts by a specific user.
- Manages comments on posts (creation, retrieval, updating, deletion).
- Allows retrieval of comments by user or post.
- Implements API key authentication for secure access.
- Provides clear and concise error responses.

# Endpoints
- GET / 
    - GET /api
        - GET /api/users
        - POST /api/users
            - GET /api/users/:id
            - PATCH /api/users/:id
            - DELETE /api/users/:id
            - GET /api/users/:id/posts
                - Retrieves all posts by a user with the specified id.
            
        - GET /api/posts
        - POST /api/posts
            - GET /api/posts?userId=<VALUE>
                - Retrieves all posts by a user with the specified postId.
            - GET /api/posts/:id
            - PATCH /api/posts/:id
            - DELETE /api/posts/:id

    - GET /comments
    - POST /comments
        - When creating a new comment object, it should have the following fields:
            - id: a unique identifier.
            - userId: the id of the user that created the comment.
            - postId: the id of the post the comment was made on.
            - body: the text of the comment.
        - GET /comments?userId=<VALUE>
            - Retrieves comments by the user with the specified userId.
        - GET /comments?postId=<VALUE>
            - Retrieves comments made on the post with the specified postId.
        - GET /comments/:id
            - Retrieves the comment with the specified id.
        - PATCH /comments/:id
            - Used to update a comment with the specified id with a new body.
        - DELETE /comments/:id
            - Used to delete a comment with the specified id.

[Project Documentation](https://www.canva.com/design/DAGmy6Vp_xY/MlM0zPVliJuI3cW85bacRA/view?utm_content=DAGmy6Vp_xY&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hb99c4b34c1)

* This is a Node.js project.