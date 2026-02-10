import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { message, Input, Divider, Row, Col } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import moment from "moment";
import { getAllTheatresByMovie } from "../api/shows";
import { getMovieById } from "../api/movies";

const SingleMovie = () => {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [theatres, setTheatres] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDate = (e) => {
    const selectedDate = moment(e.target.value).format("YYYY-MM-DD");
    setDate(selectedDate);
    navigate(`/movie/${id}?date=${selectedDate}`);
  };

  const getMovieData = useCallback(async () => {
    try {
      dispatch(showLoading());
      const response = await getMovieById(id);
      if (response.success) {
        setMovie(response.data);
      } else {
        message.error(response.message);
      }
    } catch (err) {
      message.error(err.message || "Failed to fetch movie data");
    } finally {
      dispatch(hideLoading());
    }
  }, [dispatch, id]);

  const getTheatres = useCallback(async () => {
    try {
      dispatch(showLoading());
      const response = await getAllTheatresByMovie({ movie: id, date });
      if (response.success) {
        setTheatres(response.data);
      } else {
        message.error(response.message);
      }
    } catch (err) {
      message.error(err.message || "Failed to fetch theatres");
    } finally {
      dispatch(hideLoading());
    }
  }, [dispatch, id, date]);

  useEffect(() => {
    getMovieData();
  }, [getMovieData]);

  useEffect(() => {
    getTheatres();
  }, [getTheatres]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Movie Info */}
      {movie && (
        <div className="flex flex-col md:flex-row gap-6 bg-white rounded-xl shadow-sm p-6">
          <img
            src={movie.poster}
            alt={movie.movieName}
            className="w-40 rounded-lg shadow-md"
          />

          <div className="flex-1 space-y-2">
            <h1 className="text-2xl font-bold text-gray-800">
              {movie.movieName}
            </h1>

            <p className="text-gray-600">
              Language: <span className="font-medium">{movie.language}</span>
            </p>

            <p className="text-gray-600">
              Genre: <span className="font-medium">{movie.genre}</span>
            </p>

            <p className="text-gray-600">
              Release Date:{" "}
              <span className="font-medium">
                {moment(movie.date).format("MMM Do YYYY")}
              </span>
            </p>

            <p className="text-gray-600">
              Duration:{" "}
              <span className="font-medium">
                {movie.duration} Minutes
              </span>
            </p>

            <Divider />

            {/* Date Picker */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <label className="text-gray-700 font-medium">
                Choose the date:
              </label>
              <Input
                type="date"
                value={date}
                min={moment().format("YYYY-MM-DD")}
                onChange={handleDate}
                prefix={<CalendarOutlined />}
                className="max-w-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* No Theatres */}
      {theatres.length === 0 && (
        <div className="text-center py-6">
          <h2 className="text-lg font-semibold text-blue-600">
            Currently, no theatres available for this movie!
          </h2>
        </div>
      )}

      {/* Theatres List */}
      {theatres.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800">Theatres</h2>

          {theatres.map((theatre) => (
            <div key={theatre._id}>
              <Row gutter={[24, 16]}>
                <Col xs={24} lg={8}>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {theatre.name}
                  </h3>
                  <p className="text-gray-500">{theatre.address}</p>
                </Col>

                <Col xs={24} lg={16}>
                  <ul className="flex flex-wrap gap-3">
                    {theatre.shows
                      .sort(
                        (a, b) =>
                          moment(a.time, "HH:mm") -
                          moment(b.time, "HH:mm")
                      )
                      .map((show) => (
                        <li
                          key={show._id}
                          onClick={() =>
                            navigate(`/book-show/${show._id}`)
                          }
                          className="px-4 py-2 border border-blue-500 rounded-md text-blue-600 font-medium cursor-pointer hover:bg-blue-500 hover:text-white transition"
                        >
                          {moment(show.time, "HH:mm").format("hh:mm A")}
                        </li>
                      ))}
                  </ul>
                </Col>
              </Row>

              <Divider />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SingleMovie;