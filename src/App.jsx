import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ConfigProvider } from "antd";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import PrivateRoute from "./guards/PrivateRoute";
import CompleteRegistration from "./pages/complete-registeration/CompleteRegistration";
import MainLayout from "./layouts/MainLayout";
import Profile from "./pages/profile/Profile";
import VerifyEmail from "./pages/verify-email/VerifyEmail";
import PublicRoute from "./guards/PublicRoute";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#261fb3",
        },
      }}
    >
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="complete-registration"
            element={
              <PrivateRoute>
                <MainLayout>
                  <CompleteRegistration />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
