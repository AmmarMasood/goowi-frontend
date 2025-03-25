import React from "react";
import { Modal, Button, message } from "antd";
import { useAuth } from "../../context/AuthContext";

function CompleteVerificationPopup({ onCompleteVerification }) {
  const [messageApi, contextHolder] = message.useMessage();
  const { resendVerificationEmail } = useAuth();
  const onResendEmail = async () => {
    try {
      await resendVerificationEmail();
      messageApi.success("Verification email sent successfully");
    } catch (error) {
      console.error(error);
      messageApi.error("Error sending verification email");
    }
  };
  return (
    <>
      {contextHolder}
      <Modal
        title="Verify Your Email Address"
        open={true}
        closable={false}
        footer={[
          <Button key="submit" type="primary" onClick={onCompleteVerification}>
            Done
          </Button>,
          <Button key="submit" type="primary" onClick={onResendEmail}>
            Resend Email
          </Button>,
        ]}
      >
        <p>Please verify your email address to continue.</p>
      </Modal>
    </>
  );
}

export default CompleteVerificationPopup;
