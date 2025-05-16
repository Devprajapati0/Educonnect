import React, { useState } from 'react';
import {
  Button, Box, Typography, Paper, Divider, Grid, Snackbar,
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemButton, ListItemText, Chip,
  ListItemIcon, Tooltip, Badge, ListItemAvatar, Avatar,
  Collapse, IconButton
} from '@mui/material';
import { CheckCircle, HourglassEmpty, Cancel, ExpandLess, ExpandMore } from '@mui/icons-material';
import { Editor } from '@tinymce/tinymce-react';
import { styled } from '@mui/system';
import Leftbar from './Leftbar';
import {
  useComplainToAdminMutation,
  useGetAdminsAndStudentsQuery,
  useGetMyComplaintsQuery,
} from '../../store/api/api';

function getInstitutionAndRoleFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const institution = parts[0] || "EduConnect";
  const role = parts[1] || "guest";
  return { institution, role };
}

// Styled Components
const ComplaintContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 8,
  width: '100%',
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  textAlign: 'center',
}));

const StyledEditor = styled(Editor)(() => ({
  width: '100%',
  '& .tox-editor-container': {
    border: '1px solid #ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  '& .tox-toolbar': {
    backgroundColor: '#f5f5f5',
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  fontSize: '16px',
  fontWeight: 600,
  padding: theme.spacing(1, 4),
  marginTop: theme.spacing(2),
  borderRadius: '8px',
}));

const ComplaintHistory = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  maxHeight: 600,
  overflowY: 'auto',
  borderRadius: 8,
  backgroundColor: '#fdfdfd',
  width: '100%',
}));

const ComplaintBox = () => {
  const [complaint, setComplaint] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openAdminDialog, setOpenAdminDialog] = useState(false);
  const [openStudentDialog, setOpenStudentDialog] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const { institution, role } = getInstitutionAndRoleFromPath();
  const apiKey = import.meta.env.VITE_TINY_MCE_API_KEY;

  const { data } = useGetAdminsAndStudentsQuery(
    { subdomain: institution, role },
    { refetchOnMountOrArgChange: true, skip: !institution || !role }
  );

  const [complainToAdmin] = useComplainToAdminMutation();
  const { data: getMyComplain, refetch } = useGetMyComplaintsQuery(
    { subdomain: institution, role },
    { refetchOnMountOrArgChange: true, skip: !institution || !role }
  );

  const admins = data?.data?.admin || [];
  const students = data?.data?.student || [];
  const complainList = getMyComplain?.data || [];

  const extractBase64Images = (html) => {
    const imgRegex = /<img[^>]+src=["'](data:image\/[^"']+)["'][^>]*>/g;
    let match;
    const base64Images = [];
    while ((match = imgRegex.exec(html)) !== null) {
      base64Images.push(match[1]);
    }
    return base64Images;
  };

  const handleSubmit = async () => {
    if (!selectedAdmin || !selectedStudent || !complaint.trim()) {
      setSnackbarMessage('Please complete all fields before submitting.');
      setOpenSnackbar(true);
      return;
    }

    const base64Imgs = extractBase64Images(complaint);
    try {
      const response = await complainToAdmin({
        content: complaint,
        toAdmin: selectedAdmin._id,
        referToStudent: selectedStudent._id,
        attachment: base64Imgs[0] || null,
        subdomain: institution,
        role,
      }).unwrap();

      if (response.statuscode === 201) {
        setSnackbarMessage('Complaint submitted successfully!');
        setComplaint('');
        setSelectedAdmin('');
        setSelectedStudent('');
        refetch();
      } else {
        setSnackbarMessage('Error submitting complaint.');
      }
    } catch (err) {
      setSnackbarMessage('Submission failed. Try again.');
    } finally {
      setOpenSnackbar(true);
    }
  };

  return (
    <div className="flex" style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Box sx={{ width: 70, position: 'fixed', top: 0, left: 0, height: '100vh', bgcolor: '#0e1c2f', zIndex: 1100 }}>
        <Leftbar />
      </Box>

      <Box sx={{ ml: '70px', p: 2 }}>
        <Grid container spacing={2} direction={{ xs: 'column', sm: 'row' }}>
          {/* Complaint Form */}
          <Grid item xs={12} sm={6} md={4}>
            <ComplaintContainer>
              <Title>Submit a Complaint</Title>

              <Grid container spacing={1} mb={2}>
                <Grid item xs={6}>
                  <Button variant="outlined" onClick={() => setOpenAdminDialog(true)} fullWidth>Select Admin</Button>
                </Grid>
                <Grid item xs={6}>
                  <Button variant="outlined" onClick={() => setOpenStudentDialog(true)} fullWidth>Select Student</Button>
                </Grid>
              </Grid>

              <Grid container spacing={1} mb={2}>
                {selectedAdmin && (
                  <Grid item xs={12} sm="auto">
                    <Chip
                      label={`Admin: ${selectedAdmin.name}`}
                      avatar={<Avatar src={selectedAdmin.avatar || ''} />}
                      color="primary"
                      onDelete={() => setSelectedAdmin('')}
                    />
                  </Grid>
                )}
                {selectedStudent && (
                  <Grid item xs={12} sm="auto">
                    <Chip
                      label={`Student: ${selectedStudent.name}`}
                      avatar={<Avatar src={selectedStudent.avatar || ''} />}
                      color="secondary"
                      onDelete={() => setSelectedStudent('')}
                    />
                  </Grid>
                )}
              </Grid>

              <StyledEditor
                apiKey={apiKey}
                value={complaint}
                init={{
                  height: 400,
                  menubar: true,
                  plugins: [
                    'image', 'advlist', 'lists', 'link', 'preview', 'media', 'table', 'help', 'wordcount',
                  ],
                  toolbar: "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | image | help",
                  file_picker_callback: (callback) => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = () => {
                      const file = input.files[0];
                      const reader = new FileReader();
                      reader.onload = () => callback(reader.result, { alt: file.name });
                      reader.readAsDataURL(file);
                    };
                    input.click();
                  },
                }}
                onEditorChange={(content) => setComplaint(content)}
              />

              <Divider sx={{ my: 2 }} />
              <Grid container justifyContent="flex-end">
                <SubmitButton variant="contained" onClick={handleSubmit}>Submit Complaint</SubmitButton>
              </Grid>
            </ComplaintContainer>
          </Grid>

          {/* Complaint History */}
          <Grid item xs={12} md={6} lg={5}>
            <ComplaintHistory elevation={2}>
              <Typography variant="h6" gutterBottom>Submitted Complaints</Typography>
              {complainList.length === 0 ? (
                <Typography color="text.secondary" textAlign="center">
                  You have not submitted any complaints.
                </Typography>
              ) : (
                <List>
                  {complainList.map((c) => (
                    <React.Fragment key={c._id}>
                      <ListItem alignItems="flex-start" divider>
                        <ListItemIcon>
                          <Tooltip title={c.status}>
                            <Badge
                              color={
                                c.status === "approved" ? "success" :
                                  c.status === "rejected" ? "error" : "warning"
                              }
                              variant="dot"
                            >
                              {c.status === "approved" ? (
                                <CheckCircle color="success" />
                              ) : c.status === "rejected" ? (
                                <Cancel color="error" />
                              ) : (
                                <HourglassEmpty color="warning" />
                              )}
                            </Badge>
                          </Tooltip>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              {c.referToStudent && (
                                <Avatar src={c.referToStudent.avatar} sx={{ width: 24, height: 24 }} />
                              )}
                              <Typography variant="subtitle1" fontWeight="medium">
                                {c.referToStudent?.name || "No student referenced"}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" color="text.secondary">
                                {new Date(c.createdAt).toLocaleString()}
                              </Typography>
                              <Collapse in={expandedId === c._id}>
                                <Typography variant="body2" color="text.secondary" dangerouslySetInnerHTML={{ __html: c.content }} />
                              </Collapse>
                            </>
                          }
                        />
                        <IconButton onClick={() => setExpandedId(expandedId === c._id ? null : c._id)}>
                          {expandedId === c._id ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              )}
            </ComplaintHistory>
          </Grid>
        </Grid>
      </Box>

      {/* Admin Dialog */}
      <Dialog open={openAdminDialog} onClose={() => setOpenAdminDialog(false)}>
        <DialogTitle>Select Admin</DialogTitle>
        <DialogContent>
          <List>
            {admins.map((admin) => (
              <ListItemButton key={admin._id} onClick={() => {
                setSelectedAdmin(admin);
                setOpenAdminDialog(false);
              }}>
                <ListItemAvatar><Avatar src={admin.avatar || ''} /></ListItemAvatar>
                <ListItemText primary={admin.name} />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdminDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Student Dialog */}
      <Dialog open={openStudentDialog} onClose={() => setOpenStudentDialog(false)}>
        <DialogTitle>Select Student</DialogTitle>
        <DialogContent>
          <List>
            {students.map((student) => (
              <ListItemButton key={student._id} onClick={() => {
                setSelectedStudent(student);
                setOpenStudentDialog(false);
              }}>
                <ListItemAvatar><Avatar src={student.avatar || ''} /></ListItemAvatar>
                <ListItemText primary={student.name} />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStudentDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </div>
  );
};

export default ComplaintBox;