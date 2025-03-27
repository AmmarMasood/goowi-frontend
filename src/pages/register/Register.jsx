import React from "react";
import { Form, Input, Button, Select } from "antd";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "../../components/Loader/Loader";

const { Option } = Select;
const Register = () => {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [error, setError] = React.useState(null);
  const { register } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      setError(null);
      await register(values);
      navigate("/complete-registration", { replace: true });
    } catch (error) {
      setError(error);
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center h-screen w-screen justify-center max-md:!px-8 overflow-y-auto">
      <Loader show={loading} />
      <h1 className="text-5xl font-bold mb-8">Create a new account</h1>
      <Form
        name="register"
        onFinish={onFinish}
        layout="vertical"
        className="w-1/3 mx-auto mt-4 max-md:w-full "
        form={form}
        autoComplete="off"
      >
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: "Please input your first name!" }]}
        >
          <Input placeholder="First Name" />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: "Please input your last name!" }]}
        >
          <Input placeholder="Last Name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please input a valid email!",
            },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              min: 6,
              message: "Password must be at least 6 characters!",
            },
          ]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item
          label="Register as"
          name="role"
          rules={[{ required: true, message: "Please select account type!" }]}
        >
          <Select placeholder="Select account type">
            <Option value={"company"}>Company</Option>
            <Option value={"person"}>Person</Option>
            <Option value={"charity"}>Charity</Option>
          </Select>
        </Form.Item>

        <Form.Item className="flex justify-end">
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
      {error && <div className="text-red-500">{error.message}</div>}
      <div className="mt-4">
        Already have an account? <Link to="/login">Log in to your account</Link>
      </div>
    </div>
  );
};

export default Register;
