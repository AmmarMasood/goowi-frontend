import { Spin } from "antd";

export const Loader = ({ show }) => {
  return show ? (
    <div
      className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-50"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.5)", // White background with 80% opacity
      }}
    >
      <Spin size="large" className="mr-4" />
    </div>
  ) : null;
};
