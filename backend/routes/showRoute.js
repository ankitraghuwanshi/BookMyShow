const showsRouter = require("express").Router();

const { addShow, deleteShow, updateShow, getAllShowsByTheatre, getAllTheatresByMovie, getShowById } = require("../controller/showController");
const authMiddleware = require("../middleware/authMiddleware")

// Add Show
showsRouter.post("/add-show", authMiddleware, addShow);

// delete Show
showsRouter.post("/delete-show", authMiddleware, deleteShow);

// Update show
showsRouter.put("/update-show", authMiddleware, updateShow);

//get All Shows By Theatre
showsRouter.post("/get-all-shows-by-theatre", authMiddleware, getAllShowsByTheatre);

// Get all theatres by movie which has some shows
showsRouter.post("/get-all-theatres-by-movie", authMiddleware, getAllTheatresByMovie);

//get show by Id
showsRouter.post("/get-show-by-id", authMiddleware, getShowById);

module.exports = showsRouter;