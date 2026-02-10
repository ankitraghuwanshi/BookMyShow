const bookingRouter = require('express').Router();

const { makePayment, bookShow, getAllBooking } = require('../controller/bookingController');

const authMiddleware = require("../middleware/authMiddleware");

//make payment
bookingRouter.post('/make-payment', authMiddleware, makePayment);

// Create a booking after the payment
bookingRouter.post('/book-show', authMiddleware, bookShow);

//get all booking
bookingRouter.get("/get-all-bookings", authMiddleware, getAllBooking);


module.exports = bookingRouter;