import React, { useState } from 'react';
import {
  Button, Box, Typography, Paper, Divider, Grid, Snackbar,
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemButton, ListItemText, Chip,
  ListItemIcon, Tooltip, Badge,ListItemAvatar, Avatar
} from '@mui/material';
import { CheckCircle, HourglassEmpty } from '@mui/icons-material';
import { Editor } from '@tinymce/tinymce-react';
import { styled } from '@mui/system';
import { Collapse, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Cancel from "@mui/icons-material/Cancel";
// Dummy data
const dummyAdmins = ['Admin John', 'Admin Jane', 'Admin Robert'];
const dummyStudents = ['Student A', 'Student B', 'Student C'];
const dummyComplaints = [
  { id: 1, title: 'Misbehavior by Student A', approved: true },
  { id: 2, title: 'Late assignment submission', approved: false },
  { id: 3, title: 'Disruption in class by Student C', approved: true },
];

function getInstitutionAndRoleFromPath() {
  const pathname = window.location.pathname
  const parts = pathname.split("/").filter(Boolean)

  const institution = parts[0] || "EduConnect"
  const role = parts[1] || "guest"

  return { institution, role }
}

const ComplaintContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 8,
}));

import Leftbar from './Leftbar';
import { useComplainToAdminMutation, useGetAdminsAndStudentsQuery, useGetMyComplaintsQuery } from '../../store/api/api';
const Title = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  textAlign: 'center',
}));

const StyledEditor = styled(Editor)(({ theme }) => ({
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
}));

const ComplaintBox = () => {
  const [complaint, setComplaint] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openAdminDialog, setOpenAdminDialog] = useState(false);
  const [openStudentDialog, setOpenStudentDialog] = useState(false);
  const [open, setOpen] = useState(false);

  const handleChange = (content) => setComplaint(content);
  const {institution, role} = getInstitutionAndRoleFromPath()

  const {data} = useGetAdminsAndStudentsQuery({
    subdomain:institution,
    role,
  }, {
    refetchOnMountOrArgChange: true,
    skip: !institution || !role,
  });

  const [complainToAdmin ]= useComplainToAdminMutation();
  const {data:getMyComplain,refetch} = useGetMyComplaintsQuery({
    subdomain: institution,
    role, 
  }, {
    refetchOnMountOrArgChange: true,
    skip: !institution || !role,
  });
  console.log("getMyComplain", getMyComplain)
  const complain = getMyComplain?.data || [];
  // console.log("data", data)
  const admins = data?.data?.admin || [];
  const students = data?.data?.student || [];
  // console.log("admins", admins)
  // console.log("students", students)
  const extractBase64Images = (html) => {
    const imgRegex = /<img[^>]+src=["'](data:image\/[^"']+)["'][^>]*>/g;
    let match;
    const base64Images = [];
  
    while ((match = imgRegex.exec(html)) !== null) {
      base64Images.push(match[1]); // the base64 string
    }
  
    return base64Images;
  };

  const handleSubmit = async () => {
    if (!selectedAdmin) {
      setSnackbarMessage('Please select an admin before submitting.');
      setOpenSnackbar(true);
      return;
    }
    if(!selectedStudent) {
      setSnackbarMessage('Please select a student before submitting.');
      setOpenSnackbar(true);
      return;
    }

    if (complaint.trim() === '') {
      setSnackbarMessage('Please write a complaint before submitting.');
      setOpenSnackbar(true);
      return;
    }
    const base64Imgs = extractBase64Images(complaint);
    console.log('Base64 Images:', base64Imgs);
    try {
      console.log('Submitting complaint:', {
        complaint,
        to: selectedAdmin,
        referTo: selectedStudent,
      });

      const data = {
        content: complaint,
        toAdmin: selectedAdmin._id,
        referToStudent: selectedStudent._id,
        attachment: base64Imgs[0] || null,
        subdomain: institution,
        role,
      };
      const response = await complainToAdmin(data).unwrap();
      console.log('Response:', response);
      if (response.statuscode === 201) {
        setSnackbarMessage('Complaint submitted successfully!');
        setComplaint('');
        setSelectedAdmin('');
        setSelectedStudent('');
        refetch();
      } else {
        setSnackbarMessage('Error submitting complaint.');
      }
    } catch (error) {
      setSnackbarMessage('Submission failed. Try again.');
    } finally {
      setOpenSnackbar(true);
    }
  };

  const apiKey = import.meta.env.VITE_TINY_MCE_API_KEY;

  return (<div className='flex'>

      <Leftbar />

    <Box sx={{ maxWidth: '1200px', margin: 'auto', padding: 3 }}>
      <Grid container spacing={3}>
        {/* Left: Complaint Form */}
        <Grid item xs={12} md={7}>
          <ComplaintContainer>
            <Title>Submit a Complaint</Title>

            <Grid container spacing={2} mb={2}>
              <Grid item>
                <Button variant="outlined" onClick={() => setOpenAdminDialog(true)}>
                  Select Admin
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" onClick={() => setOpenStudentDialog(true)}>
                  Select Student 
                </Button>
              </Grid>
            </Grid>

            <Grid container spacing={2} mb={2}>
            {selectedAdmin && (
  <Grid item>
    <Chip
      label={`Admin: ${selectedAdmin.name})`}
      avatar={<Avatar src={selectedAdmin.avatar || ''} />}
      color="primary"
      onDelete={() => setSelectedAdmin('')}
    />
  </Grid>
)}

{selectedStudent && (
  <Grid item>
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
                  'image', 'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'fullscreen', 'insertdatetime',
                  'media', 'table', 'code', 'help', 'wordcount',
                ],
                toolbar:
                  "undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image | removeformat | help",
                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
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
              onEditorChange={handleChange}
            />

            <Divider sx={{ marginY: 2 }} />

            <Grid container justifyContent="flex-end">
              <SubmitButton variant="contained" onClick={handleSubmit}>
                Submit Complaint
              </SubmitButton>
            </Grid>
          </ComplaintContainer>
        </Grid>

        {/* Right: Complaint History */}
        <Grid item xs={12} md={5}>
      <ComplaintHistory elevation={2}>
        <Typography variant="h6" gutterBottom>
          Submitted Complaints
        </Typography>

        {complain?.length === 0 ? (
          <Typography color="text.secondary" textAlign="center">
            You have not submitted any complaints.
          </Typography>
        ) : (
          <List>
            {complain.map((complaint) => (
              <ListItem key={complaint._id} alignItems="flex-start" divider>
                <ListItemIcon>
                <Tooltip
          title={
            complaint.status === "approved"
              ? "Approved"
              : complaint.status === "rejected"
              ? "Rejected"
              : "Pending"
          }
        >
          <Badge
            color={
              complaint.status === "approved"
                ? "success"
                : complaint.status === "rejected"
                ? "error"
                : "warning"
            }
            variant="dot"
          >
            {complaint.status === "approved" ? (
              <CheckCircle color="success" />
            ) : complaint.status === "rejected" ? (
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
            {complaint.referToStudent && (
              <Avatar
                src={complaint.referToStudent.avatar}
                sx={{ width: 24, height: 24 }}
              />
            )}
            <Typography variant="subtitle1" fontWeight="medium">
              {complaint.referToStudent?.name || "No student referenced"}
            </Typography>
          </Box>
        }
        secondary={
          <>
            <Typography variant="body2" color="text.secondary">
              {new Date(complaint.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap={!open}>
              <span
                dangerouslySetInnerHTML={{
                  __html: open
                    ? complaint.content
                    : `${complaint.content.slice(0, 60)}...`,
                }}
              />
            </Typography>
          </>
        }
      />
       <IconButton onClick={() => setOpen(!open)}>
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </IconButton>
              </ListItem>
            ))}
          </List>
        )}
      </ComplaintHistory>
    </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />

      {/* Admin Dialog */}
      <Dialog open={openAdminDialog} onClose={() => setOpenAdminDialog(false)}>
        <DialogTitle>Select an Admin</DialogTitle>
        <DialogContent>
          
          <List>
            {admins.map((admin) => (
               <ListItem key={admin._id} disablePadding>
               <ListItemButton
                 onClick={() => {
                   setSelectedAdmin(admin);
                   setOpenAdminDialog(false);
                 }}
               >
                 <ListItemAvatar>
                   <Avatar src={admin.avatar} alt={admin.name}>
                     {admin.name[0].toUpperCase()}
                   </Avatar>
                 </ListItemAvatar>
           
                 <ListItemText
                   primary={
                     <Typography sx={{ fontWeight: 500 }}>
                       {admin.name}
                     </Typography>
                   }
                   secondary={
                     <Typography variant="body2" color="textSecondary">
                       {admin.email}
                     </Typography>
                   }
                 />
                
               </ListItemButton>
             </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdminDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Student Dialog */}
      <Dialog open={openStudentDialog} onClose={() => setOpenStudentDialog(false)}>
        <DialogTitle>Select a Student</DialogTitle>
        <DialogContent>
          <List>
            {students.map((student) => (
              <ListItem disablePadding key={student}>
                <ListItemButton
                  onClick={() => {
                    setSelectedStudent(student);
                    setOpenStudentDialog(false);
                  }}
                >
                   <ListItemAvatar>
                   <Avatar src={student.avatar} alt={student.name}>
                     {student.name[0].toUpperCase()}
                   </Avatar>
                 </ListItemAvatar>
           
                 <ListItemText
                   primary={
                     <Typography sx={{ fontWeight: 500 }}>
                       {student.name}
                     </Typography>
                   }
                   secondary={
                     <Typography variant="body2" color="textSecondary">
                       {student.email}
                     </Typography>
                   }
                 />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStudentDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
    </div>
  );
};

export default ComplaintBox;