const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Favorites = require("../models/favorites");
const cors = require("./cors");
var authenticate = require("../authenticate");
const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
      .populate("user")
      .populate("dish")
      .then(
        (favorites) => {
          if (favorites) {
            const userFavorites = favorites.filter((favorite) => {
              favorite.user._id.toString() === req.user.id.toString();
            })[0];
            if (!userFavorites) {
              var err = new Error("List of favorites is empty! add one!");
              err.status = 404;
              return next(err);
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(userFavorites);
          } else {
            var err = new Error("There are no favourites");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
      .populate("user")
      .populate("dish")
      .then((favorites) => {
        if (favorites) {
          const user = favorites.filter(
            (favorite) =>
              favorite.user._id.toString() === req.user._id.toString()
          )[0];
          if (!user) {
            user = new Favorites({
              user: req.user._id,
            });
          }
          req.body.forEach((dishId) => {
            if (user.dishes.indexOf(dishId) === -1) {
              user.dishes.push(dishId);
            }
          });
          user
            .save()
            .then(
              (userFavorites) => {
                res.statusCode = 201;
                res.setHeader("Content-Type", "application/json");
                res.json(userFavorites);
                console.log("Favourites Created");
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        }
      });
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation is not supported on /favourites");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
      .populate("user")
      .populate("dish")
      .then(
        (favorites) => {
          if (favorites) {
            const userFavorites = favorites.filter((favorite) => {
              favorite.user._id.toString() === req.user._id.toString();
            })[0];

            if (!userFavorites) {
              var err = new Error("You do not have any favourites");
              err.status = 404;
              return next(err);
            }

            userFavorites.remove().then(
              (result) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(result);
              },
              (err) => next(err)
            );
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

favoriteRouter
  .route("/:dishId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
      .populate("user")
      .populate("dish")
      .then(
        (favorites) => {
          if (favorites) {
            const userFavorites = favorites.filter((favorite) => {
              favorite.user._id.toString() === req.user.id.toString();
            })[0];
            if (!userFavorites) {
              var err = new Error("List of favorites is empty! add one!");
              err.status = 404;
              return next(err);
            }
            const userDish = userFavorites.dishes.filter((dish) => {
              dish._id.toString() === req.params.dishId.toString();
            })[0];
            if (!userDish) {
              var err = new Error(
                `Dish with dish id ${req.params.dishId} does not exists in your list`
              );
              err.status = 404;
              return next(err);
            } else {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(userDish);
            }
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
      .populate("user")
      .populate("dish")
      .then(
        (favorites) => {
          const userFavorites = favorites.filter((favorite) => {
            favorite.user._id.toString() === req.user._id.toString();
          })[0];
          if (!userFavorites) {
            userFavorites = new Favorites({
              user: req.user._id,
            });
          }
          const userDishes = userFavorites.dishes.filter((dish) => {
            dish._id.toString() === req.params.dishId.toString();
          });
          if (userDishes.indexOf(req.params.dishId) === -1) {
            userFavorites.dishes.push(req.params.dishId);
            userFavorites.save().then(
              (user) => {
                res.statusCode = 201;
                res.setHeader("Content-Type", "application/json");
                res.json(user);
              },
              (err) => next(err)
            );
          } else {
            var err = new Error(
              `Dish with dishId ${req.params.dishId} already exists in your favorite list`
            );
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      "PUT operation is not supported on /favourites/" + req.params.dishId
    );
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
      .populate("user")
      .populate("dish")
      .then(
        (favorites) => {
          const userFavorites = favorites.filter((favorite) => {
            favorite.user._id.toString() === req.user._id.toString();
          })[0];
          if (!userFavorites) {
            var err = new Error("List of favorites is empty! add one!");
            err.status = 404;
            return next(err);
          }
          const userDishes = userFavorites.filter((dish) => {
            dish._id.toString() !== req.params.dishId.toString();
          });
          userFavorites.dishes = userDishes;
          userFavorites.save().then(
            (user) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(user);
            },
            (err) => next(err)
          );
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = favoriteRouter;
