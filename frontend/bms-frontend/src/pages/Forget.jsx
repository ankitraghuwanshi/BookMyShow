import React, { useEffect } from 'react'
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { forgetPassword } from '../api/users';

function Forget() {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate("/");
        }
    }, [navigate]);

    const onFinish = async (values) => {
        try {
            const response = await forgetPassword(values);
            if (response.status === "success") {
                message.success(response.message);
                alert("OTP sent to your email");
                window.location.href = '/reset';
            } else {
                message.error(response.message);
            }
        } catch (error) {
            message.error(error.message);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white shadow-md rounded-lg max-w-md w-full p-6">
                <h1 className="text-2xl font-bold text-center mb-6">Forget Password</h1>

                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Email is required" }]}
                    >
                        <Input
                            type="email"
                            placeholder="Enter your Email"
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md text-lg"
                        >
                            SEND OTP
                        </Button>
                    </Form.Item>
                </Form>

                <p className="text-center text-gray-600 mt-4">
                    Existing User? <Link to="/login" className="text-blue-600 hover:underline">Login Here</Link>
                </p>
            </div>
        </div>
    )
}

export default Forget;