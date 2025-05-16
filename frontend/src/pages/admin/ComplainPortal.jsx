import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, CardActions, Button, Grid,
  Chip, Avatar, Divider, Snackbar, CircularProgress, Dialog,
  DialogTitle, DialogContent, IconButton, Tooltip, Stack
} from '@mui/material';
import { CheckCircle, Cancel, Visibility, Close } from '@mui/icons-material';
import { styled } from '@mui/system';
import moment from 'moment';
import Leftbar from '../common/Leftbar';
import { useGetComplaintsAssignedToMeQuery, useResolveComplaintMutation } from '../../store/api/api';

const SIDEBAR_WIDTH = 70;

const DashboardContainer = styled(Box)({
  display: 'flex',
  backgroundColor: 'white',
  color: '#1e293b',
  minHeight: '100vh',
});

const ContentArea = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: SIDEBAR_WIDTH,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    marginLeft: SIDEBAR_WIDTH,
  },
}));

const ComplaintCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
}));

const StripHtmlPreview = (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('img, video, audio, iframe').forEach(el => el.remove());
  return doc.body.textContent || "";
};

function getInstitutionAndRoleFromPath() {
  const pathname = window.location.pathname;
  const parts = pathname.split("/").filter(Boolean);
  return {
    institution: parts[0] || "EduConnect",
    role: parts[1] || "guest"
  };
}

const AdminComplaintDashboard = () => {
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [previewComplaint, setPreviewComplaint] = useState(null);
  const { institution, role } = getInstitutionAndRoleFromPath();

  const { data, isLoading, refetch } = useGetComplaintsAssignedToMeQuery(
    { subdomain: institution, role },
    {
      refetchOnMountOrArgChange: true,
      skip: !institution || !role,
    }
  );

  const [resolve] = useResolveComplaintMutation();
  const complaints = data?.data || [];

  const handleStatusChange = async (id, status) => {
    const response = await resolve({ subdomain: institution, role, complaintId: id, decision: status });
    if (response.data?.statuscode === 200) {
      setSnackbar({ open: true, message: `Complaint ${status.toLowerCase()}!` });
      await refetch();
      setPreviewComplaint(null);
    } else {
      setSnackbar({ open: true, message: 'Failed to update complaint status' });
    }
  };

  return (
    <DashboardContainer>
      <Box
        sx={{
          width: SIDEBAR_WIDTH,
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          bgcolor: '#0e1c2f',
          zIndex: 1100,
          borderRight: '1px solid #1f2937',
        }}
      >
        <Leftbar />
      </Box>

      <ContentArea>
        <Typography variant="h4" fontWeight={700} color="#1976d2" mb={4}>
          🛠️ Admin Complaint Dashboard
        </Typography>

        {isLoading ? (
          <Box display="flex" justifyContent="center" mt={10}>
            <CircularProgress color="info" />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {complaints.map(({ _id, submittedBy: sender, content, status, createdAt, referToStudent: studentfor }) => (
              <Grid item xs={12} md={6} key={_id}>
                <ComplaintCard>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                      <Avatar src={sender?.avatar} />
                      <Box>
                        <Typography fontWeight={600}>{sender?.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Role: {sender?.role} • {moment(createdAt).fromNow()}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.6 }}>
                      {StripHtmlPreview(content).slice(0, 200)}...
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Chip
                        label={status}
                        color={
                          status === 'pending' ? 'warning' :
                            status === 'approved' ? 'success' : 'error'
                        }
                      />
                      <Tooltip title="Preview Full Complaint">
                        <IconButton onClick={() =>
                          setPreviewComplaint({ sender, content, createdAt, status, studentfor })
                        }>
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>

                  {status === 'pending' && (
                    <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                      <Button
                        variant="outlined"
                        color="success"
                        startIcon={<CheckCircle />}
                        onClick={() => handleStatusChange(_id, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Cancel />}
                        onClick={() => handleStatusChange(_id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </CardActions>
                  )}
                </ComplaintCard>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ open: false, message: '' })}
          message={snackbar.message}
        />

        {/* Complaint Preview Dialog */}
        <Dialog
          open={Boolean(previewComplaint)}
          onClose={() => setPreviewComplaint(null)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 2,
              backgroundColor: "#fff",
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pb: 0,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              📝 Complaint Preview
            </Typography>
            <IconButton onClick={() => setPreviewComplaint(null)}>
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers sx={{ mt: 1 }}>
            <Box mb={3}>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Typography variant="subtitle2" color="text.secondary" width={130}>
                  Submitted by:
                </Typography>
                <Avatar src={previewComplaint?.sender?.avatar} sx={{ width: 28, height: 28 }} />
                <Typography>
                  <b>{previewComplaint?.sender?.name}</b> ({previewComplaint?.sender?.role})
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Typography variant="subtitle2" color="text.secondary" width={130}>
                  Submitted on:
                </Typography>
                <Typography>
                  {moment(previewComplaint?.createdAt).format("dddd, D MMM YYYY, h:mm A")}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Typography variant="subtitle2" color="text.secondary" width={130}>
                  Submitted for:
                </Typography>
                <Avatar src={previewComplaint?.studentfor?.avatar} sx={{ width: 28, height: 28 }} />
                <Typography>
                  <b>{previewComplaint?.studentfor?.name}</b>
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="subtitle2" color="text.secondary" width={130}>
                  Status:
                </Typography>
                <Typography
                  color={
                    previewComplaint?.status === "approved"
                      ? "green"
                      : previewComplaint?.status === "rejected"
                        ? "red"
                        : "orange"
                  }
                  fontWeight="bold"
                >
                  {previewComplaint?.status?.toUpperCase()}
                </Typography>
              </Stack>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box
              dangerouslySetInnerHTML={{ __html: previewComplaint?.content }}
              sx={{
                color: "#1e293b",
                lineHeight: 1.7,
                p: 2,
                borderRadius: 2,
                backgroundColor: "#f9f9f9",
                fontSize: "0.95rem",
              }}
            />
          </DialogContent>
        </Dialog>
      </ContentArea>
    </DashboardContainer>
  );
};

export default AdminComplaintDashboard;