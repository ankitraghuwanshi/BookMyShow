const express = require("express");
const theatreRouter = express.Router()

const { addTheatre, updateTheatre, deleteTheatre, getAllTheatres, getAllTheatresByOwner } = require("../controller/theatreController");
const authMiddleware = require("../middleware/authMiddleware");

//Add theatre
theatreRouter.post('/add-theatre', authMiddleware, addTheatre);

// Update theatre
theatreRouter.put('/update-theatre', authMiddleware, updateTheatre)

// Delete theatre
theatreRouter.delete('/delete-theatre', authMiddleware, deleteTheatre);

// Getting all theatres
theatreRouter.get("/get-all-theatres", authMiddleware, getAllTheatres)

// Getting all theatres for a particular user ID as owner
theatreRouter.get("/get-all-theatres-by-owner/:ownerID", authMiddleware, getAllTheatresByOwner)

module.exports = theatreRouter