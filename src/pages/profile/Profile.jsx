import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const { userDetails } = useAuth();

  useEffect(() => {
    if (userDetails && userDetails.profileExists === false) {
      navigate("/complete-registration", { replace: true });
    }
  }, [userDetails]);

  return <div>Profile</div>;
};

export default Profile;
