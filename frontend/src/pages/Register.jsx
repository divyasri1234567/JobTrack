import { useState } from "react";
import { Alert, Box, Button, Link, TextField, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import api from "../api/api";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register/", {
        username,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      const data = err.response?.data;

      if (data?.username) {
        setError(data.username[0]);
      } else if (data?.email) {
        setError(data.email[0]);
      } else if (data?.password) {
        setError(data.password[0]);
      } else {
        setError("Unable to create account.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={styles.page}>
      <Box sx={styles.card}>
        <Typography sx={styles.logo}>JobTrack</Typography>

        <Typography sx={styles.title}>Create account</Typography>

        <Typography sx={styles.subtitle}>
          Start tracking your job applications today.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleRegister}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            sx={styles.field}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </Box>

        <Typography sx={styles.loginText}>
          Already have an account?{" "}
          <Link component={RouterLink} to="/login">
            Sign in
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

  loginText: {
    textAlign: "center",
    color: "#64748b",
    mt: 3,
    fontSize: "14px",
  },
};

export default Register;