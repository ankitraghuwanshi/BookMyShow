const BookingModel = require("../model/bookingModel");
const ShowModel = require("../model/showModel");
const stripe = require('stripe')(process.env.STRIPE_KEY);

const makePayment = async (req, res) => {
    try {
        const { amount, showId, seats, email } = req.body;

        // Create payment intent with metadata
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // amount in cents
            currency: 'usd',
            payment_method_types: ['card'],
            receipt_email: email,
            metadata: {
                showId: showId,
                seats: seats.join(', '),
                userId: req.user.userId
            },
            description: "Movie ticket booking"
        });

        res.send({
            success: true,
            message: "Payment intent created successfully!",
            data: {
                clientSecret: paymentIntent.client_secret,
                transactionId: paymentIntent.id
            }
        });
    } catch (err) {
        res.send({
            success: false,
            message: err.message
        });
    }
};

const bookShow = async (req, res) => {
    try {
        const newBooking = new BookingModel(req.body);
        await newBooking.save();

        const show = await ShowModel.findById(req.body.show).populate("movie");
        const updatedBookedSeats = [...show.bookedSeats, ...req.body.seats];

        await ShowModel.findByIdAndUpdate(req.body.show, {
            bookedSeats: updatedBookedSeats
        });

        res.send({
            success: true,
            message: 'New Booking done!',
            data: newBooking
        });
    } catch (err) {
        res.send({
            success: false,
            message: err.message
        });
    }
};

const getAllBooking = async (req, res) => {
    try {
        const bookings = await BookingModel.find({ user: req.user.userId })
            .populate("user")
            .populate("show")
            .populate({
                path: "show",
                populate: {
                    path: "movie",
                    model: "movies"
                }
            })
            .populate({
                path: "show",
                populate: {
                    path: "theatre",
                    model: "theatres"
                }
            });

        res.send({
            success: true,
            message: "Bookings fetched!",
            data: bookings
        });
    } catch (err) {
        res.send({
            success: false,
            message: "Internal Server error"
        });
    }
};

module.exports = {
    makePayment,
    bookShow,
    getAllBooking
};