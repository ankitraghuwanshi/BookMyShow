import { Col, Modal, Row, Form, Input, Select, Button, message } from "antd";
import moment from "moment";
import TextArea from "antd/es/input/TextArea";
import { showLoading, hideLoading } from "../redux/loaderSlice";
import { useDispatch } from "react-redux";
import { addMovie, updateMovie } from "../api/movies";

const MovieForm = ({
  isModalOpen,
  setIsModalOpen,
  selectedMovie,
  setSelectedMovie,
  formType,
  getData,
}) => {
  const dispatch = useDispatch();

  // if (selectedMovie) {
  //   selectedMovie.releaseDate = new Date(selectedMovie.releaseDate)
  //     .toISOString()
  //     .split("T")[0];
  // }

	const formattedMovie = selectedMovie
  	? {
      	...selectedMovie,
      	releaseDate: moment(selectedMovie.releaseDate).format("YYYY-MM-DD"),
    	}
  	: null

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      let response = null;

      if (formType === "add") {
        response = await addMovie(values);
      } else {
        response = await updateMovie({
          ...values,
          movieId: selectedMovie._id,
        });
      }

      if (response.success) {
        getData();
        message.success(response.message);
        setIsModalOpen(false);
      } else {
        message.error(response.message);
      }

      setSelectedMovie(null);
      dispatch(hideLoading());
    } catch (err) {
      dispatch(hideLoading());
      message.error(err);
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  return (
    <Modal
      centered
      title={formType === "add" ? "Add Movie" : "Edit Movie"}
      open={isModalOpen}
      onCancel={handleCancel}
      width={800}
      footer={null}
      className="rounded-xl"
    >
      <Form
        layout="vertical"
        initialValues={formattedMovie}
        onFinish={onFinish}
        className="space-y-4"
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              label="Movie Name"
              name="movieName"
              rules={[{ required: true, message: "Movie name is required!" }]}
              className="font-semibold"
            >
              <Input
                placeholder="Enter the movie name"
                className="rounded-lg py-2"
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Description is required!" },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Enter the description"
                className="rounded-lg"
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Form.Item
                  label="Duration (min)"
                  name="duration"
                  rules={[
                    {
                      required: true,
                      message: "Movie duration is required!",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    placeholder="Duration"
                    className="rounded-lg py-2"
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Language"
                  name="language"
                  rules={[
                    {
                      required: true,
                      message: "Movie language is required!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select Language"
                    className="rounded-lg"
                    options={[
                      { value: "English", label: "English" },
                      { value: "Hindi", label: "Hindi" },
                      { value: "Punjabi", label: "Punjabi" },
                      { value: "Telugu", label: "Telugu" },
                      { value: "Bengali", label: "Bengali" },
                      { value: "German", label: "German" },
                    ]}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Release Date"
                  name="releaseDate"
                  rules={[
                    {
                      required: true,
                      message: "Movie Release Date is required!",
                    },
                  ]}
                >
                  <Input type="date" className="rounded-lg py-2" />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Form.Item
                  label="Genre"
                  name="genre"
                  rules={[
                    { required: true, message: "Movie genre is required!" },
                  ]}
                >
                  <Select
                    placeholder="Select Genre"
                    className="rounded-lg"
                    options={[
                      { value: "Action", label: "Action" },
                      { value: "Comedy", label: "Comedy" },
                      { value: "Horror", label: "Horror" },
                      { value: "Love", label: "Love" },
                      { value: "Patriot", label: "Patriot" },
                      { value: "Bhakti", label: "Bhakti" },
                      { value: "Thriller", label: "Thriller" },
                      { value: "Mystery", label: "Mystery" },
                    ]}
                  />
                </Form.Item>
              </Col>

              <Col span={16}>
                <Form.Item
                  label="Poster URL"
                  name="poster"
                  rules={[
                    { required: true, message: "Movie Poster is required!" },
                  ]}
                >
                  <Input
                    placeholder="Enter poster URL"
                    className="rounded-lg py-2"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        <Form.Item className="pt-2">
          <Button
            block
            type="primary"
            htmlType="submit"
            className="h-11 rounded-lg font-semibold"
          >
            Submit
          </Button>

          <Button
            block
            onClick={handleCancel}
            className="mt-3 h-11 rounded-lg"
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MovieForm;