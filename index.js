const express = require("express");

// We import the body-parser package.
// This package contains middleware that can handle
// the parsing of many different kinds of data,
// making it easier to work with data in routes that
// accept data from the client (POST, PATCH).
const bodyParser = require("body-parser");

const users = require("./routes/users");
const posts = require("./routes/posts");
const comments = require("./routes/comments"); // Import the new comments route

const commentsData = require("./data/comments");

const error = require("./utilities/error");

const app = express();
const port = 3000;

// Parsing Middleware
// We use the body-parser middleware FIRST so that
// we have access to the parsed data within our routes.
// The parsed data will be located in "req.body".
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

// Logging Middlewaare
app.use((req, res, next) => {
  const time = new Date();

  console.log(
    `-----
${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`
  );
  if (Object.keys(req.body).length > 0) {
    console.log("Containing the data:");
    console.log(`${JSON.stringify(req.body)}`);
  }
  next();
});

// Valid API Keys.
apiKeys = ["perscholas", "ps-example", "hJAsknw-L198sAJD-l3kasx"];

/** http://localhost:3000/api?api-key=perscholas **/
// New middleware to check for API keys!
// Note that if the key is not verified,
// we do not call next(); this is the end.
// This is why we attached the /api/ prefix
// to our routing at the beginning!
app.use("/api", function (req, res, next) {
  let key = req.query["api-key"];
  console.log("Key used: " + key)
  // Check for the absence of a key.
  if (!key) next(error(400, "API Key Required"));

  // Check for key validity.
  if (apiKeys.indexOf(key) === -1) next(error(401, "Invalid API Key"));

  // Valid key! Store it in req.key for route access.
  req.key = key;
  next();
});

// Use our Routes
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/comments", comments); // Mount the comments route at /comments


// Adding some HATEOAS links.
app.get("/", (req, res) => {
  res.json({
    links: [
      {
        href: "/api",
        rel: "api",
        type: "GET",
      },
    ],
  });
});

// Adding some HATEOAS links.
app.get("/api", (req, res) => {
  res.json({
    links: [
      {
        href: "api/users",
        rel: "users",
        type: "GET",
      },
      {
        href: "api/users",
        rel: "users",
        type: "POST",
      },
      {
        href: "/api/users/:id/posts",
        rel: "user-posts",
        type: "GET",
      },
      {
        href: "api/posts",
        rel: "posts",
        type: "GET",
      },
      {
        href: "api/posts",
        rel: "posts",
        type: "POST",
      },
      {
        href: "/api/posts?userId=<VALUE>",
        rel: "posts-by-user",
        type: "GET",
      },
      {
        href: "/comments",
        rel: "comments",
        type: "GET",
      },
      {
        href: "/comments",
        rel: "comments",
        type: "POST",
      },
      {
        href: "/comments/:id",
        rel: "comment",
        type: "GET",
      },
      {
        href: "/comments/:id",
        rel: "comment",
        type: "PATCH",
      },
      {
        href: "/comments/:id",
        rel: "comment",
        type: "DELETE",
      },
      {
        href: "/comments?userId=<VALUE>",
        rel: "comments-by-user",
        type: "GET",
      },
      {
        href: "/comments?postId=<VALUE>",
        rel: "comments-by-post",
        type: "GET",
      },
      {
        href: "/posts/:id/comments",
        rel: "post-comments",
        type: "GET",
      },
      {
        href: "/users/:id/comments",
        rel: "user-comments",
        type: "GET",
      },
      {
        href: "/api/posts/:id/comments?userId=<VALUE>",
        rel: "post-comments-by-user",
        type: "GET",
      },
      {
        href: "/api/users/:id/comments?postId=<VALUE>",
        rel: "user-comments-by-post",
        type: "GET",
      },
    ],
  });
});

// GET "/posts/:id/comments"
// Retrieve all comments made on a specific post
app.get("/posts/:id/comments", (req, res, next) => {
  const postId = parseInt(req.params.id);
  const postComments = commentsData.filter((comment) => comment.postId === postId);
  res.json(postComments);
});

// GET /users/:id/comments/
// Retrieve comments made by a specific user
app.get("/users/:id/comments", (req, res, next) => {
  const userId = parseInt(req.params.id);
  const userComments = commentsData.filter((comment) => comment.userId === userId);
  res.json(userComments);
});

// GET /posts/:id/comments?userId=<VALUE>
// Retrieve all comments made on a specific post by a specific user
app.get("/posts/:id/comments", (req, res, next) => {
  const postId = parseInt(req.params.id);
  const userIdQuery = parseInt(req.query.userId);
  let postComments = comments.filter((comment) => comment.postId === postId);
  if (!isNaN(userIdQuery)) {
    postComments = postComments.filter((comment) => comment.userId === userIdQuery);
  }
  res.json(postComments);
});

// GET /users/:id/comments?postId=<VALUE>
// Retrieve comments made by a specific user on a specific post
app.get("/users/:id/comments", (req, res, next) => {
  const userId = parseInt(req.params.id);
  const postIdQuery = parseInt(req.query.postId);
  let userComments = comments.filter((comment) => comment.userId === userId);
  if (!isNaN(postIdQuery)) {
    userComments = userComments.filter((comment) => comment.postId === postIdQuery);
  }
  res.json(userComments);
});


// 404 Middleware
app.use((req, res, next) => {
  next(error(404, "Resource Not Found"));
});

// Error-handling middleware.
// Any call to next() that includes an
// Error() will skip regular middleware and
// only be processed by error-handling middleware.
// This changes our error handling throughout the application,
// but allows us to change the processing of ALL errors
// at once in a single location, which is important for
// scalability and maintainability.
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500);
  res.json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}.`);
});
