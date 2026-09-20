import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Pagination,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import Navbar from "../components/Navbar";

import {
  getApplicationsRequest,
  createApplicationRequest,
  updateApplicationRequest,
  deleteApplicationRequest,
} from "../redux/applicationActions";

const STATUS_OPTIONS = [
  { value: "APPLIED", label: "Applied" },
  { value: "INTERVIEW", label: "Interview" },
  { value: "TECHNICAL", label: "Technical Round" },
  { value: "HR", label: "HR Round" },
  { value: "OFFER", label: "Offer" },
  { value: "REJECTED", label: "Rejected" },
  { value: "WITHDRAWN", label: "Withdrawn" },
];

const emptyForm = {
  company: "",
  job_title: "",
  job_url: "",
  location: "",
  status: "APPLIED",
  applied_date: "",
  salary: "",
  notes: "",
};

function Dashboard() {
  const dispatch = useDispatch();

  const {
    applications,
    count,
    loading,
    error,
    message,
  } = useSelector((state) => state.applications);

  /*
   * Dashboard statistics will come from the backend
   * instead of calculating them from the current page.
   */
  const [dashboardStats, setDashboardStats] = useState({
    total: 0,
    interviews: 0,
    offers: 0,
    rejected: 0,
    pipeline: {
      APPLIED: 0,
      INTERVIEW: 0,
      TECHNICAL: 0,
      HR: 0,
      OFFER: 0,
      REJECTED: 0,
    },
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const pageSize = 10;

  /*
   * Get paginated applications.
   */
  useEffect(() => {
    dispatch(
      getApplicationsRequest({
        search,
        status: statusFilter,
        page,
      })
    );
  }, [dispatch, search, statusFilter, page]);

  /*
   * Get overall dashboard statistics.
   *
   * This API is separate from the paginated applications API.
   */
  useEffect(() => {
    const getDashboardStats = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const response = await fetch(
          "http://127.0.0.1:8000/api/dashboard/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setDashboardStats(data.response);
        }
      } catch (error) {
        console.error("Unable to load dashboard statistics.");
      }
    };

    getDashboardStats();
  }, [message]);

  useEffect(() => {
    if (message) {
      setOpenDialog(false);
      setEditingId(null);
      setForm(emptyForm);
      setSnackbarOpen(true);
    }
  }, [message]);

  const total = dashboardStats.total;
  const interviews = dashboardStats.interviews;
  const offers = dashboardStats.offers;
  const rejected = dashboardStats.rejected;

  const totalPages = Math.ceil(count / pageSize);

  const pipeline = [
    { key: "APPLIED", label: "Applied" },
    { key: "INTERVIEW", label: "Interview" },
    { key: "TECHNICAL", label: "Technical Round" },
    { key: "HR", label: "HR Round" },
    { key: "OFFER", label: "Offer" },
    { key: "REJECTED", label: "Rejected" },
  ];

  const getStatusLabel = (status) => {
    const item = STATUS_OPTIONS.find(
      (option) => option.value === status
    );

    return item ? item.label : status;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const [year, month, day] = date.split("-");

    return `${day}-${month}-${year}`;
  };

  const formatSalary = (salary) => {
    if (!salary) return "-";

    return `₹${Number(salary).toLocaleString("en-IN")}`;
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpenDialog(true);
  };

  const handleEdit = (application) => {
    setEditingId(application.id);

    setForm({
      company: application.company || "",
      job_title: application.job_title || "",
      job_url: application.job_url || "",
      location: application.location || "",
      status: application.status || "APPLIED",
      applied_date: application.applied_date || "",
      salary: application.salary || "",
      notes: application.notes || "",
    });

    setOpenDialog(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      salary: form.salary === "" ? null : form.salary,
    };

    if (editingId) {
      dispatch(updateApplicationRequest(editingId, payload));
    } else {
      dispatch(createApplicationRequest(payload));
    }
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this application?"
      )
    ) {
      dispatch(deleteApplicationRequest(id));
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  return (
    <Box sx={styles.page}>
      <Navbar />

      <Box sx={styles.container}>
        <Box sx={styles.header}>
          <Box>
            <Typography sx={styles.title}>
              Your Job Search
            </Typography>

            <Typography sx={styles.subtitle}>
              Track your applications and stay organized throughout your job search.
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={handleOpenAdd}
            sx={styles.addButton}
          >
            + Add Application
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Statistics */}
        <Box sx={styles.statsGrid}>
          <Box sx={styles.statCard}>
            <Typography sx={styles.statLabel}>
              Total Applications
            </Typography>

            <Typography sx={styles.statValue}>
              {total}
            </Typography>
          </Box>

          <Box sx={styles.statCard}>
            <Typography sx={styles.statLabel}>
              Interviews
            </Typography>

            <Typography sx={styles.statValue}>
              {interviews}
            </Typography>
          </Box>

          <Box sx={styles.statCard}>
            <Typography sx={styles.statLabel}>
              Offers
            </Typography>

            <Typography sx={styles.statValue}>
              {offers}
            </Typography>
          </Box>

          <Box sx={styles.statCard}>
            <Typography sx={styles.statLabel}>
              Rejected
            </Typography>

            <Typography sx={styles.statValue}>
              {rejected}
            </Typography>
          </Box>
        </Box>

        {/* Pipeline */}
        <Box sx={styles.section}>
          <Typography sx={styles.sectionTitle}>
            Application Pipeline
          </Typography>

          <Box sx={styles.pipelineGrid}>
            {pipeline.map((item) => (
              <Box
                key={item.key}
                sx={styles.pipelineCard}
              >
                <Typography sx={styles.pipelineLabel}>
                  {item.label}
                </Typography>

                <Typography sx={styles.pipelineCount}>
                  {dashboardStats.pipeline?.[item.key] || 0}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Applications */}
        <Box sx={styles.section}>
          <Box sx={styles.tableHeader}>
            <Box>
              <Typography sx={styles.sectionTitle}>
                Your Applications
              </Typography>

              <Typography sx={styles.tableSubtitle}>
                Manage and track all your job applications.
              </Typography>
            </Box>

            <Box sx={styles.filters}>
              <TextField
                size="small"
                placeholder="Search company or job title"
                value={search}
                onChange={handleSearchChange}
                sx={styles.searchField}
              />

              <TextField
                select
                size="small"
                label="Status"
                value={statusFilter}
                onChange={handleStatusChange}
                sx={styles.statusField}
              >
                <MenuItem value="">
                  All Statuses
                </MenuItem>

                {STATUS_OPTIONS.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>

          <Box sx={styles.tableWrapper}>
            {loading && applications.length === 0 ? (
              <Box sx={styles.loading}>
                <CircularProgress size={30} />
              </Box>
            ) : applications.length === 0 ? (
              <Box sx={styles.empty}>
                <Typography sx={styles.emptyTitle}>
                  No applications found
                </Typography>

                <Typography sx={styles.emptyText}>
                  Add your first job application to start tracking your job search.
                </Typography>
              </Box>
            ) : (
              <>
                <Box sx={styles.table}>
                  <Box
                    sx={{
                      ...styles.tableRow,
                      ...styles.tableHead,
                    }}
                  >
                    <Typography sx={styles.companyColumn}>
                      Company
                    </Typography>

                    <Typography sx={styles.jobColumn}>
                      Job Title
                    </Typography>

                    <Typography sx={styles.locationColumn}>
                      Location
                    </Typography>

                    <Typography sx={styles.statusColumn}>
                      Status
                    </Typography>

                    <Typography sx={styles.dateColumn}>
                      Applied Date
                    </Typography>

                    <Typography sx={styles.salaryColumn}>
                      Salary
                    </Typography>

                    <Typography sx={styles.actionColumn}>
                      Action
                    </Typography>
                  </Box>

                  {applications.map((application) => (
                    <Box
                      key={application.id}
                      sx={styles.tableRow}
                    >
                      <Typography sx={styles.companyColumn}>
                        {application.company}
                      </Typography>

                      <Typography sx={styles.jobColumn}>
                        {application.job_title}
                      </Typography>

                      <Typography sx={styles.locationColumn}>
                        {application.location || "-"}
                      </Typography>

                      <Box sx={styles.statusColumn}>
                        <Chip
                          label={getStatusLabel(
                            application.status
                          )}
                          size="small"
                          sx={styles.statusChip}
                        />
                      </Box>

                      <Typography sx={styles.dateColumn}>
                        {formatDate(
                          application.applied_date
                        )}
                      </Typography>

                      <Typography sx={styles.salaryColumn}>
                        {formatSalary(application.salary)}
                      </Typography>

                      <Box sx={styles.actionColumn}>
                        <Button
                          size="small"
                          onClick={() =>
                            handleEdit(application)
                          }
                          sx={styles.editButton}
                        >
                          Edit
                        </Button>

                        <Button
                          size="small"
                          onClick={() =>
                            handleDelete(application.id)
                          }
                          sx={styles.deleteButton}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>

                {totalPages > 1 && (
                  <Box sx={styles.pagination}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      shape="rounded"
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>

      {/* Add / Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={styles.dialogTitle}>
          {editingId
            ? "Edit Application"
            : "Add Application"}
        </DialogTitle>

        <DialogContent sx={styles.dialogContent}>
          <TextField
            fullWidth
            label="Company"
            name="company"
            value={form.company}
            onChange={handleChange}
            sx={styles.formField}
          />

          <TextField
            fullWidth
            label="Job Title"
            name="job_title"
            value={form.job_title}
            onChange={handleChange}
            sx={styles.formField}
          />

          <TextField
            fullWidth
            label="Job URL"
            name="job_url"
            value={form.job_url}
            onChange={handleChange}
            sx={styles.formField}
          />

          <TextField
            fullWidth
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            sx={styles.formField}
          />

          <TextField
            fullWidth
            select
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            sx={styles.formField}
          >
            {STATUS_OPTIONS.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            type="date"
            label="Applied Date"
            name="applied_date"
            value={form.applied_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={styles.formField}
          />

          <TextField
            fullWidth
            label="Salary"
            name="salary"
            type="number"
            value={form.salary}
            onChange={handleChange}
            sx={styles.formField}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            sx={styles.formField}
          />
        </DialogContent>

        <DialogActions sx={styles.dialogActions}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={styles.cancelButton}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={styles.saveButton}
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Update Application"
              : "Save Application"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f6f8fc",
  },

  container: {
    maxWidth: "1250px",
    margin: "0 auto",
    px: { xs: 2, md: 3 },
    py: { xs: 3, md: 5 },
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 2,
    mb: 4,
    flexWrap: "wrap",
  },

  title: {
    fontSize: { xs: "28px", md: "34px" },
    fontWeight: 800,
    color: "#172033",
    letterSpacing: "-0.8px",
  },

  subtitle: {
    mt: 0.8,
    color: "#64748b",
    fontSize: "15px",
  },

  addButton: {
    textTransform: "none",
    borderRadius: "9px",
    px: 2.5,
    py: 1.2,
    fontWeight: 700,
    boxShadow: "none",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, 1fr)",
      md: "repeat(4, 1fr)",
    },
    gap: 2,
    mb: 4,
  },

  statCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e7eaf0",
    borderRadius: "12px",
    padding: "22px",
    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
  },

  statLabel: {
    color: "#64748b",
    fontSize: "14px",
    fontWeight: 600,
  },

  statValue: {
    color: "#172033",
    fontSize: "30px",
    fontWeight: 800,
    mt: 1,
  },

  section: {
    backgroundColor: "#ffffff",
    border: "1px solid #e7eaf0",
    borderRadius: "12px",
    padding: { xs: 2, md: 3 },
    mb: 3,
    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
  },

  sectionTitle: {
    fontSize: "18px",
    fontWeight: 750,
    color: "#172033",
  },

  pipelineGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "repeat(2, 1fr)",
      sm: "repeat(3, 1fr)",
      md: "repeat(6, 1fr)",
    },
    gap: 1.5,
    mt: 2,
  },

  pipelineCard: {
    border: "1px solid #e7eaf0",
    borderRadius: "10px",
    padding: "16px",
    backgroundColor: "#fafbfc",
  },

  pipelineLabel: {
    color: "#64748b",
    fontSize: "13px",
    fontWeight: 600,
    minHeight: "38px",
  },

  pipelineCount: {
    fontSize: "25px",
    fontWeight: 800,
    color: "#172033",
    mt: 1,
  },

  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 2,
    flexWrap: "wrap",
    mb: 2.5,
  },

  tableSubtitle: {
    color: "#94a3b8",
    fontSize: "13px",
    mt: 0.5,
  },

  filters: {
    display: "flex",
    gap: 1,
    flexWrap: "wrap",
  },

  searchField: {
    minWidth: { xs: "100%", sm: "260px" },
  },

  statusField: {
    minWidth: "150px",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    minWidth: "950px",
  },

  tableRow: {
    display: "flex",
    alignItems: "center",
    minHeight: "65px",
    borderBottom: "1px solid #edf0f4",
    gap: 1,
    px: 1,
  },

  tableHead: {
    minHeight: "45px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px 8px 0 0",
  },

  companyColumn: {
    width: "16%",
    fontSize: "14px",
    fontWeight: 600,
    color: "#172033",
  },

  jobColumn: {
    width: "19%",
    fontSize: "14px",
    color: "#334155",
  },

  locationColumn: {
    width: "14%",
    fontSize: "14px",
    color: "#64748b",
  },

  statusColumn: {
    width: "16%",
    fontSize: "14px",
  },

  dateColumn: {
    width: "13%",
    fontSize: "14px",
    color: "#64748b",
  },

  salaryColumn: {
    width: "10%",
    fontSize: "14px",
    color: "#334155",
  },

  actionColumn: {
    width: "12%",
    display: "flex",
    gap: 0.5,
  },

  statusChip: {
    fontWeight: 600,
    backgroundColor: "#eef2ff",
    color: "#4338ca",
  },

  editButton: {
    textTransform: "none",
    fontWeight: 600,
    minWidth: "auto",
  },

  deleteButton: {
    textTransform: "none",
    fontWeight: 600,
    color: "#dc2626",
    minWidth: "auto",
  },

  loading: {
    display: "flex",
    justifyContent: "center",
    py: 7,
  },

  empty: {
    textAlign: "center",
    py: 7,
  },

  emptyTitle: {
    fontSize: "17px",
    fontWeight: 700,
    color: "#334155",
  },

  emptyText: {
    color: "#94a3b8",
    mt: 0.8,
  },

  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    py: 3,
    borderTop: "1px solid #edf0f4",
  },

  dialogTitle: {
    fontWeight: 800,
    color: "#172033",
    pb: 1,
  },

  dialogContent: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    pt: "10px !important",
  },

  formField: {
    "& .MuiInputBase-root": {
      borderRadius: "8px",
    },

    "& input[type='date']": {
      minHeight: "1.4375em",
    },
  },

  dialogActions: {
    px: 3,
    pb: 2.5,
    pt: 1,
  },

  cancelButton: {
    textTransform: "none",
    color: "#64748b",
    fontWeight: 600,
  },

  saveButton: {
    textTransform: "none",
    borderRadius: "8px",
    fontWeight: 700,
    px: 2,
    boxShadow: "none",
  },
};

export default Dashboard;