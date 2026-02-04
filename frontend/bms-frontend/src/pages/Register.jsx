import React from "react";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/users";

function Register() {
  const navigate = useNavigate();

  const onFinishRegisterForm = async (values) => {
    try {
      const responseData = await registerUser(values);
      if (responseData.success) {
        message.success(responseData.message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        message.error(responseData.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f8ff] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Register to <span className="text-[#646cff]">BookMyShow</span>
        </h1>

        {/* Form */}
        <Form layout="vertical" onFinish={onFinishRegisterForm}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input
              placeholder="Enter your name"
              className="py-2"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Email is required" }]}
          >
            <Input
              placeholder="Enter your email"
              className="py-2"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password
              placeholder="Enter your password"
              className="py-2"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="h-11 text-base font-semibold"
            >
              Register
            </Button>
          </Form.Item>
        </Form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already a user?{" "}
          <Link
            to="/login"
            className="font-medium text-[#646cff] hover:text-[#535bf2] no-underline"
          >
            Login now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;