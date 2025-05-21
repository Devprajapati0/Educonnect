import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Leftbar from './Leftbar';
import {
  useComplainToAdminMutation,
  useGetAdminsAndStudentsQuery,
  useGetMyComplaintsQuery,
} from '../../store/api/api';

// Modern UI Components
import {
  Box, Typography, Paper, Divider, Grid, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemButton, ListItemText, Chip,
  ListItemIcon, Tooltip, Badge, Avatar, Collapse, 
  IconButton, Button, TextField, InputAdornment
} from '@mui/material';

// Icons
import {
  CheckCircle, HourglassEmpty, Cancel, ExpandLess, 
  ExpandMore, Search, AccountCircle, School, Send,
  AttachFile, Image as ImageIcon, Person, AdminPanelSettings
} from '@mui/icons-material';

// Helper function to extract institution and role
function getInstitutionAndRoleFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const institution = parts[0] || "EduConnect";
  const role = parts[1] || "guest";
  return { institution, role };
}

const ComplaintBox = () => {
  const [complaint, setComplaint] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openAdminDialog, setOpenAdminDialog] = useState(false);
  const [openStudentDialog, setOpenStudentDialog] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { institution, role } = getInstitutionAndRoleFromPath();
  const apiKey = "mtyzfj577cysz3uiw6y3jqee7qwuz8cv0td50yadjxx5zjny";

  const { data } = useGetAdminsAndStudentsQuery(
    { subdomain: institution, role },
    { refetchOnMountOrArgChange: true, skip: !institution || !role }
  );

  const [complainToAdmin,{isLoading}] = useComplainToAdminMutation();
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
      setSnackbarSeverity('warning');
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
        setSnackbarSeverity('success');
        setComplaint('');
        setSelectedAdmin('');
        setSelectedStudent('');
        refetch();
      } else {
        setSnackbarMessage('Error submitting complaint.');
        setSnackbarSeverity('error');
      }
    } catch (err) {
      setSnackbarMessage('Submission failed. Try again.');
      setSnackbarSeverity('error');
    } finally {
      setOpenSnackbar(true);
    }
  };

  const filteredAdmins = admins.filter(admin => 
    admin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch(status) {
      case "approved":
        return <CheckCircle sx={{ color: '#4caf50' }} />;
      case "rejected":
        return <Cancel sx={{ color: '#f44336' }} />;
      default:
        return <HourglassEmpty sx={{ color: '#ff9800' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "approved": return '#e8f5e9';
      case "rejected": return '#ffebee';
      default: return '#fff8e1';
    }
  };
  
  return (
    <div className="flex" style={{ minHeight: '100vh', backgroundColor: '#f7f9fc' }}>
      <Box sx={{ width: 70, position: 'fixed', top: 0, left: 0, height: '100vh', bgcolor: '#1e293b', zIndex: 1100 }}>
        <Leftbar />
      </Box>

      <Box sx={{ ml: '70px', p: { xs: 1, sm: 2, md: 3 }, width: 'calc(100% - 70px)' }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: '#334155' }}>
          Complaint Management
        </Typography>
        
        <Grid container spacing={3}>
          {/* Complaint Form */}
          <Grid item xs={12} lg={5}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 600, 
                  color: '#334155',
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: 40,
                    height: 3,
                    backgroundColor: '#6366f1',
                    borderRadius: 1
                  }
                }}
              >
                Submit a Complaint
              </Typography>

              <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => setOpenAdminDialog(true)}
                  startIcon={<AdminPanelSettings />}
                  sx={{ 
                    borderRadius: 2,
                    borderColor: '#6366f1',
                    color: '#6366f1',
                    '&:hover': {
                      borderColor: '#4f46e5',
                      backgroundColor: 'rgba(99, 102, 241, 0.04)'
                    }
                  }}
                >
                  {selectedAdmin ? 'Change Admin' : 'Select Admin'}
                </Button>
                
                <Button 
                  variant="outlined" 
                  onClick={() => setOpenStudentDialog(true)}
                  startIcon={<School />}
                  sx={{ 
                    borderRadius: 2,
                    borderColor: '#6366f1',
                    color: '#6366f1',
                    '&:hover': {
                      borderColor: '#4f46e5',
                      backgroundColor: 'rgba(99, 102, 241, 0.04)'
                    }
                  }}
                >
                  {selectedStudent ? 'Change Student' : 'Select Student'}
                </Button>
              </Box>

              <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedAdmin && (
                  <Chip
                    avatar={<Avatar src={selectedAdmin.avatar || ''} alt={selectedAdmin.name} />}
                    label={`Admin: ${selectedAdmin.name}`}
                    onDelete={() => setSelectedAdmin('')}
                    sx={{ 
                      borderRadius: '12px',
                      bgcolor: '#ede9fe',
                      color: '#6366f1',
                      '& .MuiChip-deleteIcon': {
                        color: '#6366f1',
                        '&:hover': {
                          color: '#4f46e5'
                        }
                      }
                    }}
                  />
                )}
                
                {selectedStudent && (
                  <Chip
                    avatar={<Avatar src={selectedStudent.avatar || ''} alt={selectedStudent.name} />}
                    label={`Student: ${selectedStudent.name}`}
                    onDelete={() => setSelectedStudent('')}
                    sx={{ 
                      borderRadius: '12px',
                      bgcolor: '#e0f2fe',
                      color: '#0369a1',
                      '& .MuiChip-deleteIcon': {
                        color: '#0369a1',
                        '&:hover': {
                          color: '#0284c7'
                        }
                      }
                    }}
                  />
                )}
              </Box>

              <Box 
                sx={{ 
                  flex: 1,
                  border: '1px solid #e2e8f0',
                  borderRadius: 2,
                  overflow: 'hidden',
                  mb: 2,
                  '.tox-tinymce': {
                    border: 'none !important',
                    borderRadius: '8px !important'
                  }
                }}
              >
                <Editor
                  apiKey={apiKey}
                  value={complaint}
                  init={{
                    height: 400,
                    menubar: false,
                    skin: 'oxide',
                    plugins: [
                      'image', 'advlist', 'lists', 'link', 'preview', 'media', 'table', 'help', 'wordcount',
                    ],
                    toolbar: "undo redo | blocks | bold italic | alignleft aligncenter alignright | bullist numlist | image link | help",
                    file_picker_callback: (callback) => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = () => {
                        const file = input.files[0];
                        const reader = new FileReader();
                        reader.onload = () => callback(reader.result, { 
                          alt: file.name, 
                          width: '100%', // Ensure decent preview size
                          style: 'max-width: 100%; height: auto;' 
                        });
                        reader.readAsDataURL(file);
                      };
                      input.click();
                    },
                    images_upload_handler: (blobInfo, progress) => {
                      return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                          resolve(reader.result);
                        };
                        reader.readAsDataURL(blobInfo.blob());
                      });
                    },
                    image_dimensions: false,
                    image_class_list: [
                      {title: 'Responsive', value: 'img-fluid'}
                    ],
                    content_style: `
                      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; color: #334155; }
                      img { max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0; }
                    `
                  }}
                  onEditorChange={(content) => setComplaint(content)}
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  onClick={handleSubmit}
                  endIcon={<Send />}
                  disabled={isLoading}
                  sx={{ 
                    bgcolor: '#6366f1',
                    color: 'white',
                    px: 4,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                    '&:hover': {
                      bgcolor: '#4f46e5'
                    }
                  }}
                >
                  {isLoading ? 'Submitting...' : 'Submit Complaint'}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Complaint History */}
          <Grid item xs={12} lg={7}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 600, 
                  color: '#334155',
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: 40,
                    height: 3,
                    backgroundColor: '#6366f1',
                    borderRadius: 1
                  }
                }}
              >
                Submitted Complaints
              </Typography>
              
              <Box 
                sx={{ 
                  flex: 1, 
                  overflowY: 'auto', 
                  bgcolor: '#f8fafc', 
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                  p: 1,
                  minHeight: 400,
                  maxHeight: 600
                }}
              >
                {complainList.length === 0 ? (
                  <Box 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: '#94a3b8',
                      p: 3
                    }}
                  >
                    <Box component="img" src="/empty-box.svg" alt="No complaints" sx={{ width: 120, mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" color="inherit">No complaints yet</Typography>
                    <Typography variant="body2" color="inherit" textAlign="center">
                      Your submitted complaints will appear here
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ p: 0 }}>
                    {complainList.map((complaint) => (
                      <Paper
                        key={complaint._id}
                        elevation={0}
                        sx={{ 
                          mb: 2, 
                          borderRadius: 2,
                          overflow: 'hidden',
                          bgcolor: getStatusColor(complaint.status),
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                          }
                        }}
                      >
                        <ListItem 
                          alignItems="flex-start"
                          secondaryAction={
                            <IconButton 
                              edge="end" 
                              onClick={() => setExpandedId(expandedId === complaint._id ? null : complaint._id)}
                              sx={{ color: '#475569' }}
                            >
                              {expandedId === complaint._id ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                          }
                          sx={{ px: 2, py: 1.5 }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <Tooltip title={complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}>
                              {getStatusIcon(complaint.status)}
                            </Tooltip>
                          </ListItemIcon>
                          
                          <ListItemText
                            primary={
                              <Box display="flex" alignItems="center" gap={1}>
                                {complaint.referToStudent && (
                                  <Avatar 
                                    src={complaint.referToStudent.avatar} 
                                    sx={{ 
                                      width: 28, 
                                      height: 28,
                                      border: '2px solid white',
                                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }} 
                                  />
                                )}
                                <Typography variant="body1" fontWeight="500" color="#334155">
                                  {complaint.referToStudent?.name || "No student referenced"}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Typography variant="caption" color="#64748b" sx={{ display: 'block', mt: 0.5 }}>
                                {new Date(complaint.createdAt).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </Typography>
                            }
                          />
                        </ListItem>
                        
                        <Collapse in={expandedId === complaint._id} timeout="auto" unmountOnExit>
                          <Box 
                            sx={{ 
                              px: 2, 
                              pb: 2,
                              pt: 0.5,
                              mx: 2,
                              mb: 2,
                              bgcolor: 'rgba(255,255,255,0.7)', 
                              borderRadius: 2,
                              '& img': {
                                maxWidth: '100%',
                                height: 'auto',
                                borderRadius: '8px',
                                my: 1
                              }
                            }}
                          >
                            <div dangerouslySetInnerHTML={{ __html: complaint.content }} />
                          </Box>
                        </Collapse>
                      </Paper>
                    ))}
                  </List>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Admin Selection Dialog */}
      <Dialog 
        open={openAdminDialog} 
        onClose={() => setOpenAdminDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            width: '100%',
            maxWidth: { xs: '90%', sm: 400 }
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>Select Administrator</Typography>
          <TextField
            fullWidth
            placeholder="Search administrators..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mt: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 }
            }}
          />
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          <List sx={{ 
            maxHeight: 400, 
            overflow: 'auto',
            py: 0
          }}>
            {filteredAdmins.length === 0 ? (
              <ListItem sx={{ justifyContent: 'center', color: '#64748b' }}>
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Person sx={{ fontSize: 40, color: '#cbd5e1', mb: 1 }} />
                  <Typography>No administrators found</Typography>
                </Box>
              </ListItem>
            ) : (
              filteredAdmins.map((admin) => (
                <ListItemButton 
                  key={admin._id} 
                  onClick={() => {
                    setSelectedAdmin(admin);
                    setOpenAdminDialog(false);
                    setSearchTerm('');
                  }}
                  sx={{
                    py: 1.5,
                    borderBottom: '1px solid #f1f5f9',
                    '&:hover': {
                      bgcolor: '#f8fafc'
                    }
                  }}
                >
                  <Avatar 
                    src={admin.avatar || ''} 
                    alt={admin.name}
                    sx={{ 
                      mr: 2,
                      width: 42,
                      height: 42,
                      bgcolor: '#818cf8',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                  >
                    {!admin.avatar && admin.name.charAt(0)}
                  </Avatar>
                  <ListItemText 
                    primary={
                      <Typography variant="body1" fontWeight={500}>{admin.name}</Typography>
                    } 
                    secondary={
                      <Typography variant="caption" color="#64748b">Administrator</Typography>
                    }
                  />
                </ListItemButton>
              ))
            )}
          </List>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button 
            onClick={() => {
              setOpenAdminDialog(false);
              setSearchTerm('');
            }}
            sx={{ 
              color: '#64748b',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                bgcolor: '#f1f5f9'
              }
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Student Selection Dialog */}
      <Dialog 
        open={openStudentDialog} 
        onClose={() => setOpenStudentDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            width: '100%',
            maxWidth: { xs: '90%', sm: 400 }
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>Select Student</Typography>
          <TextField
            fullWidth
            placeholder="Search students..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mt: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 }
            }}
          />
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          <List sx={{ 
            maxHeight: 400, 
            overflow: 'auto',
            py: 0
          }}>
            {filteredStudents.length === 0 ? (
              <ListItem sx={{ justifyContent: 'center', color: '#64748b' }}>
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <School sx={{ fontSize: 40, color: '#cbd5e1', mb: 1 }} />
                  <Typography>No students found</Typography>
                </Box>
              </ListItem>
            ) : (
              filteredStudents.map((student) => (
                <ListItemButton 
                  key={student._id} 
                  onClick={() => {
                    setSelectedStudent(student);
                    setOpenStudentDialog(false);
                    setSearchTerm('');
                  }}
                  sx={{
                    py: 1.5,
                    borderBottom: '1px solid #f1f5f9',
                    '&:hover': {
                      bgcolor: '#f8fafc'
                    }
                  }}
                >
                  <Avatar 
                    src={student.avatar || ''} 
                    alt={student.name}
                    sx={{ 
                      mr: 2,
                      width: 42,
                      height: 42,
                      bgcolor: '#0ea5e9',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                  >
                    {!student.avatar && student.name.charAt(0)}
                  </Avatar>
                  <ListItemText 
                    primary={
                      <Typography variant="body1" fontWeight={500}>{student.name}</Typography>
                    } 
                    secondary={
                      <Typography variant="caption" color="#64748b">Student</Typography>
                    }
                  />
                </ListItemButton>
              ))
            )}
          </List>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button 
            onClick={() => {
              setOpenStudentDialog(false);
              setSearchTerm('');
            }}
            sx={{ 
              color: '#64748b',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                bgcolor: '#f1f5f9'
              }
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 8px 16px rgba(0,0,0,0.12)'
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ComplaintBox;