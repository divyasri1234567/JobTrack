import { useNavigate } from "react-router-dom";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <AppBar position="sticky" elevation={0} sx={styles.navbar}>
      <Toolbar sx={styles.toolbar}>
        <Typography variant="h6" sx={styles.logo}>
          JobTrack
        </Typography>

        <Box sx={{ flex: 1 }} />

        <Button onClick={handleLogout} sx={styles.logoutButton}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

const styles = {
  navbar: {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e7eaf0",
    color: "#172033",
  },
  toolbar: {
    maxWidth: "1250px",
    width: "100%",
    margin: "0 auto",
    minHeight: "68px",
    px: { xs: 2, md: 3 },
  },
  logo: {
    fontWeight: 800,
    fontSize: "24px",
    letterSpacing: "-0.5px",
  },
  logoutButton: {
    textTransform: "none",
    fontWeight: 600,
    color: "#475569",
  },
};

export default Navbar;