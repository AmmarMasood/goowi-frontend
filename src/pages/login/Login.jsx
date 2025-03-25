import { Button, Form, Input } from "antd";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { login } = useAuth();

  const onFinish = async (values) => {
    try {
      await login(values.email, values.password);
      navigate("/home", { replace: true });
    } catch (error) {
      form.setFields([
        {
          name: "email",
          errors: ["Invalid email or password"],
        },
        {
          name: "password",
          errors: ["Invalid email or password"],
        },
      ]);
      console.error(error);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="flex flex-col items-center h-screen w-screen justify-center">
      <h1 className="text-5xl font-bold mb-4">Login</h1>
      <Form
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
        className="w-1/3 mx-auto mt-4"
        layout="vertical"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
            {
              type: "email",
              message: "Please enter a valid email!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
            {
              min: 6,
              message: "Password must be at least 6 characters",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label={null} className="flex justify-end">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>

      <div className="mt-4">
        Don't have an account? <Link to="/register">Register Now</Link>
      </div>
    </div>
  );
};

export default Login;
