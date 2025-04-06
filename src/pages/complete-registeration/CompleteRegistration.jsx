import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../../components/ProfileForm/configs";
import { createProfile } from "../../services/profile";
import { message } from "antd";
import ProfileForm from "../../components/ProfileForm/ProfileForm";
import CompleteVerificationPopup from "../../components/CompleteVerificationPopup/CompleteVerificationPopup.jsx";

const CompleteRegistration = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(true);

  const { user, userDetails, updateProfileExists } = useAuth();
  const navigate = useNavigate();

  // Extract user role from context
  const userRole = user?.role || UserRole.PERSON;

  useEffect(() => {
    if (userDetails && userDetails.isVerified === false) {
      setIsEmailVerified(false);
    }

    if (userDetails && userDetails.profileExists) {
      navigate("/dashboard", { replace: true });
    }
  }, [userDetails]);

  const onCompleteVerification = () => {
    window.location.reload();
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const res = await createProfile(formData);
      if (res.success) {
        message.success("Profile completed successfully!");
        updateProfileExists(true); // Update profile existence in context
        navigate("/profile"); // Redirect after successful completion
      } else {
        const message =
          res.error?.response?.data?.message[0] ||
          res.error?.message ||
          "Failed to complete profile";
        setError(message);
        console.error(res.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-12 flex items-center justify-center w-full">
      {!isEmailVerified && (
        <CompleteVerificationPopup
          onCompleteVerification={onCompleteVerification}
        />
      )}
      <ProfileForm
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        userRole={userRole}
        mode="create"
        submitButtonText="Complete Registration"
      />
    </div>
  );
};

export default CompleteRegistration;
