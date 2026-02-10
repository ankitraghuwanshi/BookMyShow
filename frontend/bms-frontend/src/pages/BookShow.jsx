import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { getShowById } from "../api/shows";
import { useNavigate, useParams } from "react-router-dom";
import { message, Card, Row, Col, Button, Spin } from "antd";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import { bookShow, makePayment } from "../api/booking";

const STRIPE_PUB_KEY =
  "pk_test_51SzNDAQjPKa2CLHXObHZkCZQiIv6swxZzmhY1VzhiwmyFyKo4u8k1iL3sGv1yX16wLxmt0UUR1XdYeckrUwCHCTl00KAOBxVte";

const BookShow = () => {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  const getData = useCallback(async () => {
    try {
      dispatch(showLoading());
      const response = await getShowById({ showId: id });
      if (response.success) {
        setShow(response.data);
      } else {
        message.error(response.message || "Failed to fetch show data");
        navigate("/"); // Navigate back if show not found
      }
    } catch (err) {
      message.error(err.message || "Failed to fetch show data");
      navigate("/"); // Navigate back on error
    } finally {
      dispatch(hideLoading());
    }
  }, [dispatch, id, navigate]);

  useEffect(() => {
    getData();
  }, [getData]);

  const book = useCallback(
    async (transactionId) => {
      try {
        dispatch(showLoading());
        const response = await bookShow({
          show: id,
          transactionId,
          seats: selectedSeats,
          user: user._id,
        });

        if (response.success) {
          message.success("Show booked successfully!");
          navigate("/");
        } else {
          message.error(response.message || "Failed to book show");
        }
      } catch (err) {
        message.error(err.message || "Failed to book show");
      } finally {
        dispatch(hideLoading());
      }
    },
    [dispatch, id, selectedSeats, user._id, navigate]
  );

  const onToken = useCallback(
    async (token) => {
      if (!show) {
        message.error("Show data not loaded");
        return;
      }

      try {
        dispatch(showLoading());
        const response = await makePayment(
          token,
          selectedSeats.length * show.ticketPrice * 100
        );

        if (response.success) {
          message.success(response.message);
          book(response.data);
        } else {
          message.error(response.message || "Payment failed");
        }
      } catch (err) {
        message.error(err.message || "Payment failed");
      } finally {
        dispatch(hideLoading());
      }
    },
    [dispatch, selectedSeats, show, book]
  );

  const getSeats = () => {
    if (!show) return null;

    const columns = 12;
    const totalSeats = 120;
    const rows = totalSeats / columns;

    return (
      <div className="flex flex-col items-center space-y-6">
        {/* Screen */}
        <div className="w-full max-w-xl text-center">
          <p className="text-sm text-gray-500 mb-2">
            Screen this side — you will be watching in this direction
          </p>
          <div className="h-3 bg-gray-300 rounded-md" />
        </div>

        {/* Seats */}
        <ul className="grid grid-cols-12 gap-2 justify-center">
          {Array.from({ length: rows }).map((_, row) =>
            Array.from({ length: columns }).map((_, column) => {
              const seatNumber = row * columns + column + 1;
              if (seatNumber > totalSeats) return null;

              const isSelected = selectedSeats.includes(seatNumber);
              const isBooked = show.bookedSeats.includes(seatNumber);

              return (
                <li key={seatNumber}>
                  <button
                    disabled={isBooked}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedSeats(
                          selectedSeats.filter((s) => s !== seatNumber)
                        );
                      } else {
                        setSelectedSeats([...selectedSeats, seatNumber]);
                      }
                    }}
                    className={`w-8 h-8 text-xs rounded-md font-medium transition
                      ${
                        isBooked
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 hover:bg-blue-500 hover:text-white"
                      }`}
                  >
                    {seatNumber}
                  </button>
                </li>
              );
            })
          )}
        </ul>

        {/* Summary */}
        <div className="flex justify-between w-full max-w-xl bg-gray-100 p-4 rounded-lg text-sm">
          <div>
            <span className="font-medium">Selected Seats:</span>{" "}
            {selectedSeats.join(", ") || "-"}
          </div>
          <div className="font-semibold">
            Total: ₹ {selectedSeats.length * show.ticketPrice}
          </div>
        </div>
      </div>
    );
  };

  if (!show) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Row justify="center">
      <Col span={24}>
        <Card
          title={
            <div className="space-y-1">
              <h1 className="text-xl font-bold">{show.movie.movieName}</h1>
              <p className="text-sm text-gray-500">
                Theatre: {show.theatre.name}, {show.theatre.address}
              </p>
            </div>
          }
          extra={
            <div className="text-sm space-y-1 text-gray-700">
              <p>
                <span className="font-medium">Show:</span> {show.name}
              </p>
              <p>
                <span className="font-medium">Date & Time:</span>{" "}
                {moment(show.date).format("MMM Do YYYY")} at{" "}
                {moment(show.time, "HH:mm").format("hh:mm A")}
              </p>
              <p>
                <span className="font-medium">Ticket Price:</span> ₹{" "}
                {show.ticketPrice}
              </p>
              <p>
                <span className="font-medium">Seats:</span>{" "}
                {show.totalSeats - show.bookedSeats.length} available
              </p>
            </div>
          }
        >
          {getSeats()}

          {selectedSeats.length > 0 && (
            <StripeCheckout
              token={onToken}
              amount={selectedSeats.length * show.ticketPrice * 100}
              stripeKey={STRIPE_PUB_KEY}
            >
              <div className="max-w-xl mx-auto mt-6">
                <Button type="primary" block size="large">
                  Pay Now
                </Button>
              </div>
            </StripeCheckout>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default BookShow;