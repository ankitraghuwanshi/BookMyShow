import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import moment from 'moment'
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { getAllMovies } from "../api/movies";
import { useDispatch } from "react-redux";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
//import MovieForm from "./MovieForm";
//import DeleteMovieModal from "./DeleteMovieModal";

function MovieList() {
  //const [isModalOpen, setIsModalOpen] = useState(false);
  const [movies, setMovies] = useState([]);
  //const [selectedMovie, setSelectedMovie] = useState(null);
  //const [formType, setFormType] = useState("add");
  //const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const dispatch = useDispatch();

  const getData = async () => {
    dispatch(showLoading());
    const response = await getAllMovies();
    setMovies(
      response.movies.map((movie) => ({
        ...movie,
        key: movie._id,
      }))
    );
    dispatch(hideLoading());
  };

  useEffect(() => {
    getData();
  }, []);

  const tableHeadings = [
    {
      title: "Poster",
      dataIndex: "poster",
      render: (poster) => (
        <img
          src={poster}
          alt="poster"
          className="w-[75px] h-[115px] object-cover rounded-md"
        />
      ),
    },
    {
      title: "Movie Name",
      dataIndex: "movieName",
    },
    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      render: (text) => `${text} Min`,
    },
    {
      title: "Genre",
      dataIndex: "genre",
    },
    {
      title: "Language",
      dataIndex: "language",
    },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      render: (date) => moment(date).format("MM-DD-YYYY") 
    },
    {
      title: "Action",
      render: (_, movie) => (
        <div className="flex gap-2">
          <Button
            onClick={() => {
              //setIsModalOpen(true);
              //setSelectedMovie(movie);
              //setFormType("edit");
            }}
          >
            <EditOutlined />
          </Button>

          <Button
            danger
            onClick={() => {
              //setIsDeleteModalOpen(true);
              //setSelectedMovie(movie);
            }}
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-end">
        <Button
          type="primary"
          onClick={() => {
            //setIsModalOpen(true);
            //setFormType("add");
            //setSelectedMovie(null);
          }}
        >
          Add Movie
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <Table
          dataSource={movies}
          columns={tableHeadings}
          pagination={{ pageSize: 6 }}
        />
      </div>

      {/* Add / Edit Modal */}
      {/* {isModalOpen && (
        <MovieForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          selectedMovie={selectedMovie}
          formType={formType}
          setSelectedMovie={setSelectedMovie}
          getData={getData}
        />
      )} */}

      {/* Delete Modal */}
      {/* {isDeleteModalOpen && (
        <DeleteMovieModal
          isDeleteModalOpen={isDeleteModalOpen}
          selectedMovie={selectedMovie}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          setSelectedMovie={setSelectedMovie}
          getData={getData}
        />
      )} */}
    </div>
  );
}

export default MovieList;