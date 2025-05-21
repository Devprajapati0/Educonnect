import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from 'react-redux';
import {
  Card,
  CardContent,
  Button,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  MenuItem,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  CircularProgress,
  Divider,
  Grid
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Language,
  Business,
  CheckCircleOutline,
  ArrowForward,
  ArrowBack,
  CloudUpload,
  School
} from "@mui/icons-material";
import { loadStripe } from '@stripe/stripe-js';
import { generateKeyPair } from "../../helpers/key.js";
const stripePromise = loadStripe("pk_test_51RFZywIR3kvZWYIJoa4cAmV8FxMQivdslQsR7RDipajzlbaxplpj0q4cUn6KVECQlkxnVD4NMlFsB4pKxofQZbcp00UQcfKp5v");
import { FRONTEND_URL } from "../../helpers/url.js";
import { Loader } from "lucide-react";
import Header from "./Header.jsx";
import { setInstitute } from "../../store/slice/instituteSlice.js";
import { InfoOutlined } from "@mui/icons-material";
import { AdminPanelSettings } from "@mui/icons-material";


export default function SignupPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const [isCheckingSubDomain, setisCheckingsubDomain] = useState(false);
  const [subdomainMessage, setSubDomainMessage] = useState('');
  const [issubmit, setisSubmit] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [form, setForm] = useState({
    fullname: "",
    type: "university",
    subdomain: "",
    email: "",
    password: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    adminConfirmPassword: "",
    logo: "",
    rollnumber: ""
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setForm((prev) => ({ ...prev, logo: file }));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handlePasswordChange = (field) => (e) => {
    const newPassword = e.target.value;
    setForm({ ...form, [field]: newPassword });

    if (field === "adminPassword" || field === "password") {
      let strength = 0;
      if (newPassword.length >= 8) strength++;
      if (/[A-Z]/.test(newPassword)) strength++;
      if (/[0-9]/.test(newPassword)) strength++;
      if (/[^A-Za-z0-9]/.test(newPassword)) strength++;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisSubmit(true);

    if (step < 3) {
      setStep(step + 1);
    } else {
      try {
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
          formData.append(key, value);
        });

        const publicKey = await generateKeyPair();
        formData.append('publicKey', publicKey);

        const response = await axios.post(
          `${FRONTEND_URL}institution/signup-institution`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        dispatch(setInstitute({
          fullname: form.fullname,
          email: form.email,
          type: form.type,
          subdomain: form.subdomain,
          _id: response?.data?.data?._id,
        }));

        if(response.data.success == false){
          toast.error(response.data.message);
          return;
        }
        else{
          const stripe = await stripePromise;
          const data = await axios.post(`${FRONTEND_URL}institution/checkout-session`, {
            data: response.data.data
          });
          console.log(data);
          const session = data.data.data;
          const result = await stripe.redirectToCheckout({
               sessionId: session.id
          });
           if (result.error) {
               toast.error(result.error.message);
           }
           
          toast.success("Signup successful! ");
        }
        setisSubmit(false);
      } catch (error) {
        setisSubmit(false);
        console.error("Signup failed:", error);
        toast.error("There was an error during signup. Please try again.");
      }
    }
    setisSubmit(false);
  };

  useEffect(() => {
    const checkSubdomainUnique = async () => {
      if (form.subdomain) {
        setisCheckingsubDomain(true);
        setSubDomainMessage('');
       try {
         const response = await axios.post(`${FRONTEND_URL}institution/unique-subdomain`, {
          subdomain: form.subdomain
         });
          console.log(response);
          //add a delay
          await new Promise(resolve => setTimeout(resolve, 1000));
         setSubDomainMessage(response.data.message);
       } catch (error) {
         const axiosError = error;
         setSubDomainMessage(axiosError.response?.data.message || 'Error checking the username');
       } finally{
        setisCheckingsubDomain(false);
       }
      }
    };
    checkSubdomainUnique();
  }, [form.subdomain]);

  // Password strength indicator
  const getPasswordStrengthColor = () => {
    switch(passwordStrength) {
      case 0:
      case 1:
        return "#f44336"; // Weak - Red
      case 2:
        return "#ff9800"; // Medium - Orange
      case 3:
        return "#2196f3"; // Good - Blue
      case 4:
        return "#4caf50"; // Strong - Green
      default:
        return "#e0e0e0";
    }
  };

  return (
    <>
      <Header />
      <Box 
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4"
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Container maxWidth="md">
          <Paper 
            elevation={4} 
            className="overflow-hidden rounded-xl"
            sx={{ borderRadius: '16px', overflow: 'hidden' }}
          >
            {/* Header Section */}
            <Box className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8 text-center">
              <Typography variant="h4" className="text-white font-medium">
                Register Your Institution
              </Typography>
              <Typography variant="body1" className="text-blue-100 mt-1">
                Create an EduConnect instance for your organization
              </Typography>

              {/* Stepper */}
              <Stepper 
                activeStep={step - 1} 
                alternativeLabel 
                className="mt-8"
                sx={{ 
                  '& .MuiStepLabel-label': { 
                    color: 'rgba(255,255,255,0.7)',
                    fontWeight: 500,
                    mt: 1,
                    '&.Mui-active': { color: 'white' }
                  },
                  '& .MuiStepIcon-root': { 
                    color: 'rgba(255,255,255,0.5)',
                    '&.Mui-active': { color: 'white' },
                    '&.Mui-completed': { color: 'rgba(255,255,255,0.8)' }
                  }
                }}
              >
                <Step>
                  <StepLabel>Institution Details</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Administrator</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Confirmation</StepLabel>
                </Step>
              </Stepper>
            </Box>
            
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit}>
                {/* Step 1 - Institution Details */}
                {step === 1 && (
                  <Box className="space-y-6">
                    {/* Logo Upload Section */}
                    <Box className="flex flex-col items-center mb-6">
                      <Box className="relative mb-3">
                        <Avatar
                          src={image}
                          className="border-4 border-white shadow-lg bg-gray-100"
                          sx={{ 
                            width: 120, 
                            height: 120,
                            fontSize: 60,
                            backgroundColor: image ? 'transparent' : '#f0f4f8'
                          }}
                        >
                          {!image && <Business sx={{ fontSize: 60 }} className="text-gray-400" />}
                        </Avatar>
                        <IconButton
                          className="absolute bottom-0 right-0 bg-white shadow-md hover:bg-gray-100 border border-gray-200"
                          onClick={handleUploadClick}
                          size="small"
                          sx={{ 
                            padding: '8px',
                            backgroundColor: 'white',
                            '&:hover': { backgroundColor: '#f5f5f5' }
                          }}
                        >
                          <CloudUpload className="text-blue-600" fontSize="small" />
                        </IconButton>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          ref={fileInputRef}
                          className="hidden"
                        />
                      </Box>
                      <Typography variant="body2" className="text-gray-600">
                        Upload your institution's logo
                      </Typography>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          label="Institution Name"
                          value={form.fullname}
                          onChange={handleChange("fullname")}
                          required
                          fullWidth
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <School className="text-blue-600" />
                              </InputAdornment>
                            ),
                            sx: { borderRadius: '10px' }
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField 
                          select 
                          label="Institution Type" 
                          value={form.type} 
                          onChange={handleChange("type")} 
                          required
                          fullWidth
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: '10px' }
                          }}
                        >
                          <MenuItem value="school">School</MenuItem>
                          <MenuItem value="university">University/College</MenuItem>
                          <MenuItem value="other">Other Educational Institution</MenuItem>
                        </TextField>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Contact Email"
                          type="email"
                          value={form.email}
                          onChange={handleChange("email")}
                          required
                          fullWidth
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email className="text-blue-600" />
                              </InputAdornment>
                            ),
                            sx: { borderRadius: '10px' }
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                      <TextField
  name="subdomain"
  label="Subdomain"
  placeholder="yourschool"
  value={form.subdomain}
  onChange={handleChange("subdomain")}
  required
  fullWidth
  variant="outlined"
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <Language className="text-blue-600" />
      </InputAdornment>
    ),
    endAdornment: (
      <InputAdornment position="end" className="text-gray-500">
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 120 }}>
          <Typography variant="body2">.educonnect.com</Typography>
          {isCheckingSubDomain && (
            <CircularProgress size={16} sx={{ ml: 1 }} />
          )}
        </Box>
      </InputAdornment>
    ),
    sx: { borderRadius: '10px' }
  }}
/>

{/* Fixed height message container */}
<Box sx={{ 
  height: 24, 
  mt: 1, 
  display: 'flex',
  alignItems: 'center'
}}>
  {form.subdomain && !isCheckingSubDomain && subdomainMessage && (
    <Typography 
      variant="caption"
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        color: subdomainMessage === 'Subdomain is available' ? '#16a34a' : '#dc2626'
      }}
    >
      {subdomainMessage === 'Subdomain is available' && (
        <CheckCircleOutline fontSize="small" sx={{ mr: 0.5, fontSize: 16 }} />
      )}
      {subdomainMessage === 'Subdomain is not available' && (
        <ErrorOutline fontSize="small" sx={{ mr: 0.5, fontSize: 16 }} />
      )}
      {subdomainMessage}
    </Typography>
  )}
</Box>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          label="Create Password"
                          type={showPassword ? "text" : "password"}
                          value={form.password}
                          onChange={handlePasswordChange("password")}
                          required
                          fullWidth
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock className="text-blue-600" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton 
                                  onClick={() => setShowPassword(!showPassword)} 
                                  edge="end"
                                  size="large"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                            sx: { borderRadius: '10px' }
                          }}
                        />
                        
                        {form.password && (
                          <Box sx={{ mt: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <Box 
                                sx={{ 
                                  flexGrow: 1, 
                                  height: '4px', 
                                  borderRadius: '2px',
                                  backgroundColor: '#e0e0e0',
                                  position: 'relative',
                                }}
                              >
                                <Box 
                                  sx={{ 
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    height: '100%',
                                    width: `${25 * passwordStrength}%`,
                                    borderRadius: 'inherit',
                                    backgroundColor: getPasswordStrengthColor(),
                                    transition: 'width 0.3s ease, background-color 0.3s ease'
                                  }}
                                />
                              </Box>
                              <Typography 
                                variant="body2" 
                                sx={{ ml: 1.5, color: getPasswordStrengthColor(), fontWeight: 500 }}
                              >
                                {["Weak", "Weak", "Medium", "Good", "Strong"][passwordStrength]}
                              </Typography>
                            </Box>
                            
                            <Typography variant="caption" className="text-gray-500">
                              Use 8+ characters with a mix of uppercase, numbers, and symbols
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Step 2 - Administrator */}
{step === 2 && (
  <>
    <Typography 
      variant="h6" 
      className="font-medium text-gray-700 mb-6"
      sx={{ textAlign: 'center', fontWeight: 600,mb:4 }}
    >
      Setup Administrator Account
    </Typography>
    
    <Grid container spacing={3}>
      {/* Full name field */}
      <Grid item xs={12}>
        <TextField
          label="Administrator Name"
          value={form.adminName}
          onChange={handleChange("adminName")}
          required
          fullWidth
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person className="text-blue-600" />
              </InputAdornment>
            ),
            sx: { borderRadius: '10px' }
          }}
        />
      </Grid>

      {/* Email field */}
      <Grid item xs={12}>
        <TextField
          label="Administrator Email"
          type="email"
          value={form.adminEmail}
          onChange={handleChange("adminEmail")}
          required
          fullWidth
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email className="text-blue-600" />
              </InputAdornment>
            ),
            sx: { borderRadius: '10px' }
          }}
        />
      </Grid>

      {/* Password and confirm password fields side by side */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          value={form.adminPassword}
          onChange={handleChange("adminPassword")}
          required
          fullWidth
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock className="text-blue-600" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
            sx: { borderRadius: '10px' }
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          value={form.adminConfirmPassword}
          onChange={handleChange("adminConfirmPassword")}
          required
          fullWidth
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock className="text-blue-600" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
            sx: { borderRadius: '10px' }
          }}
        />
      </Grid>

   

      {/* Password hint or requirements */}
      <Grid item xs={12}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <InfoOutlined fontSize="small" sx={{ mr: 1, fontSize: 16 }} />
          Password should be at least 8 characters with a mix of letters, numbers, and symbols.
        </Typography>
      </Grid>
    </Grid>
  </>
)}

                {/* Step 3 - Confirmation */}
                {/* Step 3 - Confirmation */}
{/* Step 3 - Confirmation */}
{/* Step 3 - Confirmation */}
{step === 3 && (
  <>
    {/* Modern header with animation */}
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        mb: 5
      }}
    >
      <Box
        sx={{
          width: 88,
          height: 88,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
          boxShadow: '0 12px 24px -6px rgba(59, 130, 246, 0.25)',
          mb: 3,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: -4,
            left: -4,
            right: -4,
            bottom: -4,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
            zIndex: -1
          }
        }}
      >
        <CheckCircleOutline sx={{ fontSize: 44, color: 'white' }} />
      </Box>
      
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 700, 
          mb: 1.5, 
          color: '#1e293b', 
          fontSize: { xs: '1.5rem', sm: '1.75rem' },
          letterSpacing: '-0.01em'
        }}
      >
        Ready to Launch Your EduConnect Platform
      </Typography>
      
      <Typography 
        variant="body1" 
        sx={{ 
          color: '#64748b', 
          mb: 1, 
          maxWidth: 500, 
          mx: 'auto', 
          lineHeight: 1.6,
          fontSize: '1rem'
        }}
      >
        Verify your details below before we create your institution's platform
      </Typography>
    </Box>

    {/* Modern Summary Card */}
    <Box sx={{ mb: 4 }}>
      <Paper 
        elevation={0}
        sx={{ 
          borderRadius: 3, 
          overflow: 'hidden',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
        }}
      >
        {/* Header */}
        <Box 
          sx={{ 
            px: 3, 
            py: 2.5, 
            bgcolor: 'rgba(249, 250, 251, 0.8)', 
            borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <InfoOutlined sx={{ color: '#3b82f6', mr: 1.5, fontSize: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', fontSize: '1.125rem' }}>
            Review Your Registration Details
          </Typography>
        </Box>
        
        {/* Content */}
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Grid container spacing={{ xs: 4, md: 0 }}>
            {/* Institution details column */}
            <Grid item xs={12} md={6} sx={{ position: 'relative' }}>
              <Box sx={{ pr: { md: 4 } }}>
                {/* Column header */}
                <Box 
                  sx={{ 
                    mb: 3,
                    pb: 2,
                    borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: 'rgba(59, 130, 246, 0.1)', 
                      mr: 2,
                      width: 40,
                      height: 40
                    }}
                  >
                    <School sx={{ color: '#3b82f6', fontSize: 22 }} />
                  </Avatar>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#3b82f6',
                      fontSize: '1.05rem'
                    }}
                  >
                    Institution Details
                  </Typography>
                </Box>
                
                {/* Details list */}
                <Stack spacing={3.5}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box sx={{ minWidth: 110 }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#64748b', 
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em'
                        }}
                      >
                        Name
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500, 
                        color: '#334155',
                        fontSize: '0.95rem'
                      }}
                    >
                      {form.fullname || "N/A"}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box sx={{ minWidth: 110 }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#64748b', 
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em'
                        }}
                      >
                        Type
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500, 
                        color: '#334155',
                        fontSize: '0.95rem'
                      }}
                    >
                      {form.type === 'school' ? 'School' : 
                       form.type === 'university' ? 'University/College' : 
                       form.type === 'other' ? 'Other Educational Institution' : 'N/A'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box sx={{ minWidth: 110 }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#64748b', 
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em'
                        }}
                      >
                        URL
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500, 
                        color: '#334155',
                        fontSize: '0.95rem'
                      }}
                    >
                      <Box component="span" sx={{ color: '#3b82f6', fontWeight: 600 }}>
                        {form.subdomain}
                      </Box>
                      <Box component="span">.educonnect.com</Box>
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box sx={{ minWidth: 110 }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#64748b', 
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em'
                        }}
                      >
                        Email
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500, 
                        color: '#334155',
                        fontSize: '0.95rem'
                      }}
                    >
                      {form.email || "N/A"}
                    </Typography>
                  </Box>
                  
                  
    
               
                </Stack>
              </Box>
              
              {/* Vertical divider */}
              <Box
                sx={{
                  display: { xs: 'none', md: 'block' },
                  position: 'absolute',
                  right: 0,
                  top: 16,
                  bottom: 16,
                  width: 1,
                  // bgcolor: 'rgba(226, 232, 240, 0.8)'
                }}
              />
            </Grid>
            
            {/* Administrator details column */}
            <Grid item xs={12} md={6}>
              <Box sx={{ pl: { md: 4 } }}>
                {/* Column header */}
                <Box 
                  sx={{ 
                    mb: 3,
                    pb: 2,
                    borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: 'rgba(79, 70, 229, 0.1)', 
                      mr: 2,
                      width: 40,
                      height: 40
                    }}
                  >
                    <AdminPanelSettings sx={{ color: '#4f46e5', fontSize: 22 }} />
                  </Avatar>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#4f46e5',
                      fontSize: '1.05rem'
                    }}
                  >
                    Administrator Details
                  </Typography>
                </Box>

                {/* Details list */}
                <Stack spacing={3.5}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box sx={{ minWidth: 110 }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#64748b', 
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em'
                        }}
                      >
                        Name
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500, 
                        color: '#334155',
                        fontSize: '0.95rem'
                      }}
                    >
                      {form.adminName || "N/A"}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box sx={{ minWidth: 110 }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#64748b', 
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em'
                        }}
                      >
                        Email
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500, 
                        color: '#334155',
                        fontSize: '0.95rem'
                      }}
                    >
                      {form.adminEmail || "N/A"}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box sx={{ minWidth: 110 }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#64748b', 
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em'
                        }}
                      >
                        Password
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500, 
                          color: '#334155',
                          fontSize: '0.95rem'
                        }}
                      >
                        ••••••••
                      </Typography>
                      {form.adminPassword === form.adminConfirmPassword && form.adminPassword ? (
                        <Box 
                          component="span" 
                          sx={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            bgcolor: 'rgba(22, 163, 74, 0.1)', 
                            color: '#16a34a',
                            borderRadius: '4px',
                            px: 1,
                            py: 0.5,
                            ml: 1.5,
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}
                        >
                          <CheckCircleOutline sx={{ fontSize: 14, mr: 0.5 }} /> Matched
                        </Box>
                      ) : (
                        form.adminPassword && form.adminConfirmPassword ? (
                          <Box 
                            component="span" 
                            sx={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              bgcolor: 'rgba(220, 38, 38, 0.1)', 
                              color: '#dc2626',
                              borderRadius: '4px',
                              px: 1,
                              py: 0.5,
                              ml: 1.5,
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}
                          >
                            Passwords don't match
                          </Box>
                        ) : null
                      )}
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>

    {/* Next Steps Card */}
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: '1px solid rgba(226, 232, 240, 0.8)',
        backgroundColor: 'rgba(248, 250, 252, 0.6)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        mb: 2
      }}
    >
      <InfoOutlined sx={{ color: '#3b82f6', fontSize: 24, mt: 0.5 }} />
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b', mb: 1, fontSize: '0.95rem' }}>
          Next Steps After Registration
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 1.5, lineHeight: 1.6, fontSize: '0.9rem' }}>
          After completing registration, you'll be directed to select your subscription plan.
          Your admin account will have full access to manage users, messaging, and settings for your EduConnect platform.
        </Typography>
      </Box>
    </Paper>
  </>
)}

                {/* Navigation Buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: step > 1 ? 'space-between' : 'flex-end',
                  mt: 4 
                }}>
                  {step > 1 && (
                    <Button 
                      variant="outlined" 
                      onClick={() => {
                        setStep(step - 1);
                        setisSubmit(false);
                      }}
                      startIcon={<ArrowBack />}
                      sx={{ 
                        borderRadius: '10px', 
                        py: 1.5, 
                        px: 3,
                        textTransform: 'none',
                        fontWeight: 500
                      }}
                    >
                      Back
                    </Button>
                  )}
                  
                  <Button 
                    variant="contained" 
                    type="submit"
                    disabled={issubmit}
                    endIcon={step < 3 ? <ArrowForward /> : null}
                    sx={{ 
                      borderRadius: '10px', 
                      py: 1.5, 
                      px: 4,
                      background: 'linear-gradient(90deg, #3949ab 0%, #4e6ae6 100%)',
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: '0 4px 10px rgba(57, 73, 171, 0.3)'
                    }}
                  >
                    {issubmit ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      step < 3 ? "Continue" : "Complete Registration"
                    )}
                  </Button>
                </Box>
              </form>
              
              {/* Login Link */}
              {step === 1 && (
                <Box className="mt-6 pt-6 border-t border-gray-200 text-center">
                  <Typography variant="body2" className="text-gray-600">
                    Already have an account?{" "}
                    <Button 
                      onClick={() => navigate('/login')} 
                      sx={{ 
                        color: '#3949ab', 
                        textTransform: 'none', 
                        fontWeight: 500,
                        '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' } 
                      }}
                    >
                      Log in
                    </Button>
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Paper>
          
          <Typography variant="body2" className="text-center mt-4 text-gray-500">
            © 2025 EduConnect. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </>
  );
}