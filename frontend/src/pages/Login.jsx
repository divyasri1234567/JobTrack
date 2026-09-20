import { useState } from "react";
import { Alert, Box, Button, Link, TextField, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import api from "../api/api";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login/", {
        username,
        password,
      });

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Invalid username or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={styles.page}>
      <Box sx={styles.card}>
        <Typography sx={styles.logo}>JobTrack</Typography>

        <Typography sx={styles.title}>Welcome back</Typography>

        <Typography sx={styles.subtitle}>
          Sign in to manage your job applications.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            sx={styles.field}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            sx={styles.field}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={styles.button}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </Box>

        <Typography sx={styles.registerText}>
          Don't have an account?{" "}
          <Link component={RouterLink} to="/register">
            Create account
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f6f8fc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    px: 2,
  },

  card: {
    width: "100%",
    maxWidth: "430px",
    backgroundColor: "#ffffff",
    border: "1px solid #e7eaf0",
    borderRadius: "14px",
    padding: { xs: 3, sm: 4 },
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
  },

  logo: {
    fontSize: "25px",
    fontWeight: 800,
    color: "#172033",
    mb: 4,
  },

  title: {
    fontSize: "28px",
    fontWeight: 800,
    color: "#172033",
  },

  subtitle: {
    color: "#64748b",
    mt: 1,
    mb: 3,
  },

  field: {
    mb: 2,
  },

  button: {
    py: 1.3,
    borderRadius: "8px",
    textTransform: "none",
    fontWeight: 700,
    boxShadow: "none",
  },

  registerText: {
    textAlign: "center",
    color: "#64748b",
    mt: 3,
    fontSize: "14px",
  },
};

export default Login;