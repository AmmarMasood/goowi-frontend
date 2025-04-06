import { Modal } from "antd";
import React from "react";
import ProfileForm from "../../../components/ProfileForm/ProfileForm";
import { useAuth } from "../../../context/AuthContext";
import { updateProfile } from "../../../services/profile";

function EditModel({ open, setOpen, profile }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const { user } = useAuth();

  const handleSubmit = async (formData) => {
    setLoading(true);
    const res = await updateProfile(profile._id, formData);
    if (res.success) {
      setOpen(false);
      setLoading(false);
      window.location.reload();
    } else {
      setLoading(false);
      setError(res.error);
    }
  };
  return (
    <Modal
      footer={false}
      open={open}
      onCancel={() => setOpen(false)}
      width={1000}
    >
      <ProfileForm
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        initialValues={profile}
        userRole={user?.role}
        mode="update"
        submitButtonText="Update Profile"
        showSteps={false} // Optional: Hide steps for update mode
      />
    </Modal>
  );
}

export default EditModel;
