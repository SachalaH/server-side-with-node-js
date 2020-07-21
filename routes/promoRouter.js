const express = require("express");
const bodyParser = require("body-parser");

// Creating a promotion router end point
const promoRouter = express.Router();

promoRouter.use(bodyParser.json());
// Creating a route for promotion router
promoRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.end("Will send all the promotions to you!");
  })
  .post((req, res, next) => {
    res.end(
      `Will add promotion: ${req.body.name}, with details: ${req.body.description}.`
    );
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /promotions`);
  })
  .delete((req, res, next) => {
    res.end("Will delete all the promotions.");
  });

promoRouter
  .route("/:promoId")
  .get((req, res, next) => {
    res.end(`Will send the promotion: ${req.params.promoId} to you!`);
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST method not supported on /promotions/" + req.params.promoId);
  })
  .put((req, res, next) => {
    res.write(`Updating the promotion: ${req.params.promoId}`);
    res.end(
      `\nWill update the promotion with name: ${req.body.name} and details: ${req.body.description}`
    );
  })
  .delete((req, res, next) => {
    res.end("Will delete the promotion: " + req.params.promoId);
  });

module.exports = promoRouter;
