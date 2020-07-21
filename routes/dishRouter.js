const express = require("express");
const bodyParser = require("body-parser");

// Creating a dish router end point
const dishRouter = express.Router();

dishRouter.use(bodyParser.json());
// Creating a route for dish router
dishRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.end("Will send all the dishes to you!");
  })
  .post((req, res, next) => {
    res.end(
      `Will add dish: ${req.body.name}, with details: ${req.body.description}.`
    );
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /dishes");
  })
  .delete((req, res, next) => {
    res.end("Will delete all the dishes.");
  });

dishRouter
  .route("/:dishId")
  .get((req, res, next) => {
    res.end(`Will send the dish: ${req.params.dishId} to you!`);
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST method not supported on /dishes/" + req.params.dishId);
  })
  .put((req, res, next) => {
    res.write(`Updating the dish: ${req.params.dishId}`);
    res.end(
      `\nWill update the dish with name: ${req.body.name} and details: ${req.body.description}`
    );
  })
  .delete((req, res, next) => {
    res.end("Will delete the dish: " + req.params.dishId);
  });

module.exports = dishRouter;
