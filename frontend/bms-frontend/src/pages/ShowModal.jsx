import {
  Col,
  Modal,
  Row,
  Form,
  Input,
  Button,
  Select,
  Table,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import moment from 'moment';
import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/loaderSlice";
import { getAllMovies } from "../api/movies";
import {
  addShow,
  deleteShow,
  getShowsByTheatre,
  updateShow,
} from "../api/shows";

const ShowModal = ({ isShowModalOpen, setIsShowModalOpen, selectedTheatre }) => {
  const [view, setView] = useState("table");
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);

  const dispatch = useDispatch();

  const getData = useCallback(async () => {
    try {
      dispatch(showLoading());

      const movieResponse = await getAllMovies();
      if (movieResponse.success) {
        setMovies(movieResponse.movies);
      } else {
        message.error(movieResponse.message);
      }

      const showResponse = await getShowsByTheatre({
        theatreId: selectedTheatre._id,
      });
      if (showResponse.success) {
        setShows(showResponse.data);
      } else {
        message.error(showResponse.message);
      }
    } catch (error) {
      message.error(error.message || "Failed to fetch data");
    } finally {
      dispatch(hideLoading());
    }
  }, [dispatch, selectedTheatre._id]);

  useEffect(() => {
    getData();
  }, [getData]);

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());

      const response =
        view === "form"
          ? await addShow({ ...values, theatre: selectedTheatre._id })
          : await updateShow({
              ...values,
              showId: selectedShow._id,
              theatre: selectedTheatre._id,
            });

      if (response.success) {
        message.success(response.message);
        getData();
        setView("table");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message || "Operation failed");
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleDelete = async (showId) => {
    try {
      dispatch(showLoading());
      const response = await deleteShow({ showId });
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message || "Failed to delete show");
    } finally {
      dispatch(hideLoading());
    }
  };

  const columns = [
    { title: "Show Name", dataIndex: "name" },
    {
      title: "Show Date",
      dataIndex: "date",
      render: (date) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "Show Time",
      dataIndex: "time",
      render: (time) => time,
    },
    {
      title: "Movie",
      dataIndex: "movie",
      render: (_, data) => data.movie.movieName,
    },
    { title: "Ticket Price", dataIndex: "ticketPrice" },
    { title: "Total Seats", dataIndex: "totalSeats" },
    {
      title: "Available Seats",
      render: (_, data) => data.totalSeats - data.bookedSeats.length,
    },
    {
      title: "Actions",
      render: (_, data) => (
        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              setView("edit");
              setSelectedMovie(data.movie);
              setSelectedShow({
                ...data,
                date: moment(data.date).format("YYYY-MM-DD"),
                movie: data.movie._id,
              });
            }}
          >
            <EditOutlined />
          </Button>

          <Button danger onClick={() => handleDelete(data._id)}>
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Modal
      centered
      open={isShowModalOpen}
      onCancel={() => setIsShowModalOpen(false)}
      footer={null}
      width={1200}
      title={<h2 className="text-lg font-semibold">{selectedTheatre.name}</h2>}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium text-gray-700">
          {view === "table"
            ? "List of Shows"
            : view === "form"
            ? "Add Show"
            : "Edit Show"}
        </h3>

        {view === "table" && (
          <Button type="primary" onClick={() => setView("form")}>
            Add Show
          </Button>
        )}
      </div>

      {/* Table */}
      {view === "table" && (
        <div className="bg-white rounded-xl shadow-sm">
          <Table dataSource={shows} columns={columns} />
        </div>
      )}

      {/* Form */}
      {(view === "form" || view === "edit") && (
        <Form
          layout="vertical"
          initialValues={view === "edit" ? selectedShow : null}
          onFinish={onFinish}
          className="space-y-4"
        >
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item
                label="Show Name"
                name="name"
                rules={[{ required: true, message: "Please enter show name" }]}
              >
                <Input placeholder="Enter show name" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Show Date"
                name="date"
                rules={[{ required: true, message: "Please select date" }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Show Time"
                name="time"
                rules={[{ required: true, message: "Please select time" }]}
              >
                <Input type="time" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Movie"
                name="movie"
                rules={[{ required: true, message: "Please select movie" }]}
              >
                <Select
                  placeholder="Select movie"
                  options={movies.map((movie) => ({
                    value: movie._id,
                    label: movie.movieName,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Ticket Price"
                name="ticketPrice"
                rules={[{ required: true, message: "Please enter price" }]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Total Seats"
                name="totalSeats"
                rules={[{ required: true, message: "Please enter total seats" }]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex gap-4 pt-4">
            <Button block onClick={() => setView("table")}>
              <ArrowLeftOutlined /> Go Back
            </Button>

            <Button
              block
              type="primary"
              htmlType="submit"
              className="h-11 text-base font-semibold"
            >
              {view === "form" ? "Add Show" : "Edit Show"}
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default ShowModal;