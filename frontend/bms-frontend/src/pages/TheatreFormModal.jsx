import { Col, Modal, Row, Form, Input, Button, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/loaderSlice";
import { addTheatre, updateTheatre } from "../api/theatre";

const TheatreFormModal = ({
  isModalOpen,
  setIsModalOpen,
  selectedTheatre,
  setSelectedTheatre,
  formType,
  getData,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());

      let response;
      if (formType === "add") {
        response = await addTheatre({ ...values, owner: user._id });
      } else {
        response = await updateTheatre({
          ...values,
          theatreId: selectedTheatre._id,
        });
      }

      if (response.success) {
        getData();
        message.success(response.message);
        handleCancel();
      } else {
        message.error(response.message);
      }
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      message.error(error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedTheatre(null);
  };

  return (
    <Modal
      centered
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={800}
      title={
        <h2 className="text-lg font-semibold">
          {formType === "add" ? "Add Theatre" : "Edit Theatre"}
        </h2>
      }
    >
      <Form
        layout="vertical"
        initialValues={selectedTheatre}
        onFinish={onFinish}
        className="w-full"
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              label="Theatre Name"
              name="name"
              rules={[
                { required: true, message: "Theatre name is required!" },
              ]}
            >
              <Input placeholder="Enter the theatre name" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Theatre Address"
              name="address"
              rules={[
                { required: true, message: "Theatre address is required!" },
              ]}
            >
              <TextArea rows={3} placeholder="Enter the theatre address" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Email is required!" },
                  ]}
                >
                  <Input type="email" placeholder="Enter the email" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Phone Number"
                  name="phone"
                  rules={[
                    { required: true, message: "Phone number is required!" },
                  ]}
                >
                  <Input type="number" placeholder="Enter the phone number" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        <div className="mt-6 space-y-3">
          <Button
            block
            type="primary"
            htmlType="submit"
            className="h-11 text-base font-semibold"
          >
            Submit Data
          </Button>

          <Button block onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default TheatreFormModal;