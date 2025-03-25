import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { verifyEmail } from "../../services/auth";
import { Spin } from "antd";

function VerifyEmail() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useParams();
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) return; // Prevent running twice
    isMounted.current = true;

    const verifyUserEmail = async () => {
      const { success, error } = await verifyEmail(token);
      if (success) {
        setLoading(false);
      } else {
        setError(error);
        setLoading(false);
      }
    };

    verifyUserEmail();
  }, []);

  return (
    <div className="flex justify-center gap-4 items-center h-screen flex-col">
      {loading && <Spin size="large" className="mr-4" />}
      {loading && <h1>Please wait while we are completing verification...</h1>}
      {!loading && !error && <h1>Your email address has been verified</h1>}
      {error && <h1>Unable to verify your email address, please try again</h1>}
    </div>
  );
}

export default VerifyEmail;
