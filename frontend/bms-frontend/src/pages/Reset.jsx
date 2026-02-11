import React, { useEffect } from 'react'
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { resetPassword } from '../api/users';

function Reset() {

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate("/");
        }
    }, [navigate]);

    const onFinish = async (values) => {
        try {
            const response = await resetPassword(values);
            if (response.status === "success") {
                message.success(response.message);
                window.location.href = '/login';
            } else {
                message.error(response.message);
            }
        } catch (error) {
            message.error(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
                
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Reset Password
                </h1>

                <Form layout="vertical" onFinish={onFinish}>

                    <Form.Item
                        label="OTP"
                        name="otp"
                        rules={[{ required: true, message: "OTP is required" }]}
                    >
                        <Input
                            type="number"
                            placeholder="Enter your OTP"
                            className="rounded-md"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Password is required" }]}
                    >
                        <Input.Password
                            placeholder="Enter your Password"
                            className="rounded-md"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md text-lg"
                        >
                            RESET PASSWORD
                        </Button>
                    </Form.Item>

                </Form>
            </div>
        </div>
    );
}

export default Reset;