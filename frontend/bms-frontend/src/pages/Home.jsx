import { useEffect, useState, useCallback } from "react";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { useDispatch } from "react-redux";
import { getAllMovies, getAllMoviesBySearchText } from "../api/movies";
import { message, Row, Col, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getData = useCallback(async () => {
    try {
      dispatch(showLoading());
      const response = await getAllMovies();
      if (response.success) {
        setMovies(response.movies);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message || "Failed to fetch movies");
    } finally {
      dispatch(hideLoading());
    }
  }, [dispatch]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className="space-y-10">
      {/* Search Bar */}
      <Row justify="center">
        <Col xs={24} lg={12}>
          <Input
            size="large"
            placeholder="Search for movies..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            className="rounded-lg"
          />
        </Col>
      </Row>

      {/* Movies Grid */}
      <Row justify="center" gutter={[24, 32]}>
        {movies
          .filter((movie) =>
            movie.movieName
              ?.toLowerCase()
              .includes(searchText.toLowerCase())
          )
          .map((movie) => (
            <Col
              key={movie._id}
              xs={24}
              sm={12}
              md={8}
              lg={6}
              className="flex justify-center"
            >
              <div className="text-center space-y-3">
                <img
                  src={movie.poster}
                  alt={movie.movieName}
                  className="w-52 h-auto rounded-xl cursor-pointer shadow-md hover:scale-105 transition-transform"
                  onClick={() =>
                    navigate(
                      `/movie/${movie._id}?date=${moment().format(
                        "YYYY-MM-DD"
                      )}`
                    )
                  }
                />

                <h3
                  className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
                  onClick={() =>
                    navigate(
                      `/movie/${movie._id}?date=${moment().format(
                        "YYYY-MM-DD"
                      )}`
                    )
                  }
                >
                  {movie.movieName}
                </h3>
              </div>
            </Col>
          ))}
      </Row>
    </div>
  );
};

export default Home;