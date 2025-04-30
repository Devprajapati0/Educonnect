import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  MenuItem,
  
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
} from "@mui/icons-material";
import {loadStripe} from '@stripe/stripe-js'
import {generateKeyPair} from "../../helpers/key.js"
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
import { FRONTEND_URL } from "../../helpers/url.js";
import { Loader } from "lucide-react";
import Header from "./Header.jsx";


export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const [isCheckingSubDomain, setisCheckingsubDomain] = useState(false)
  const [subdomainMessage, setSubDomainMessage] = useState('')
  const [issubmit, setisSubmit] = useState(false)
  // const navigate = useNavigate();

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
    rollnumber:""
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("file", file);
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

    if (field === "adminPassword"|| field === "password") {
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
    setisSubmit(true)

    if (step < 3) {
      setStep(step + 1);
    } else {
      try {
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
          formData.append(key, value);
        });

        const publicKey = await generateKeyPair()
        console.log("publicKey", publicKey)
        formData.append('publicKey', publicKey)
        // console.log("formData", formData)

        const response = await axios.post(
          `${FRONTEND_URL}institution/signup-institution`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Success:", response.data);
        if(response.data.success == false){
          toast.error(response.data.message)
          return
        }
        else{
          const stripe   = await stripePromise;
          const data = await axios.post(`${FRONTEND_URL}institution/checkout-session`)
          console.log(data)
          const session = data.data.data
          const result = await stripe.redirectToCheckout({
               sessionId: session.id
          })
           if (result.error) {
               toast.error(result.error.message)
           }

           toast.success("Signup successful! ");
        }
        setisSubmit(false)

        
        // navigate("/signup/success");
      } catch (error) {
        setisSubmit(false)
        console.error("Signup failed:", error);
        toast.error("There was an error during signup. Please try again.");
      }
    }
    setisSubmit(false)
  };

  useEffect(() => {
    const checkSubdomainUnique = async () => {
      if (form.subdomain) {//username is debounced username
        setisCheckingsubDomain(true);
        setSubDomainMessage('');
       try {
         const response = await axios.post(`${FRONTEND_URL}institution/unique-subdomain`, {
          subdomain: form.subdomain
         })
          console.log(response)
         setSubDomainMessage(response.data.message)
       } catch (error) {
         const axiosError = error 
         setSubDomainMessage(axiosError.response?.data.message || 'Error checking the username')
       } finally{
        setisCheckingsubDomain(false)
       }
      }
    }
    checkSubdomainUnique()

   
  }, [
    form.subdomain])

  return (<>
    <Header />
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        background: "#f5f5f5",
      }}
    >
      <Card sx={{ maxWidth: 500, width: "100%" }}>
        <CardHeader
          title="Register Your Institution"
          subheader="Create an EduConnect instance for your school or university"
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* Step Indicator */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                {[1, 2, 3].map((s, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-2 ${i === 0 ? "rounded-l-full" : ""} ${i === 2 ? "rounded-r-full" : ""} ${
                      step >= s ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Institution Details</span>
                <span>Administrator</span>
                <span>Confirmation</span>
              </div>
            </div>

            {/* Step 1 */}
            {step === 1 && (
              <div className="flex flex-col items-center space-y-6">
                <div className="flex flex-col items-center">
                  <div
                    className="w-32 h-32 rounded-full border-4 border-gray-300 overflow-hidden shadow-md cursor-pointer relative group"
                    onClick={handleUploadClick}
                  >
                    {image ? (
                      <img
                        src={image}
                        alt="Institution"
                        className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400 text-4xl">
                        <Business />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                      className="hidden"
                    />
                  </div>
                  <Button variant="text" size="small" onClick={handleUploadClick} sx={{ mt: 1 }}>
                    {image ? "Change Logo" : "Upload Logo"}
                  </Button>
                </div>

                <div className="w-full flex flex-col gap-4">
                  <TextField
                    label="Institution Name"
                    value={form.fullname}
                    onChange={handleChange("fullname")}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Business />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField select label="Institution Type" value={form.type} onChange={handleChange("type")} required>
                    <MenuItem value="school">School</MenuItem>
                    <MenuItem value="university">University/College</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </TextField>
                  <TextField
                    label="Subdomain"
                    value={form.subdomain}
                    onChange={handleChange("subdomain")}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Language />
                        </InputAdornment>
                      ),
                      endAdornment: <InputAdornment position="end">.educonnect.com</InputAdornment>,
                    }}
                  />
                  {
                    isCheckingSubDomain && (
                      <Loader className="animate-spin" size={16} />
                    )
              
                  }  <p className={`text-sm ${subdomainMessage === 'Subdomain is available' ? 'text-green-500' : 'text-red-500'}`} >{subdomainMessage}</p>
                  <TextField
                    label="Contact Email"
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <TextField
                    label="Create Password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handlePasswordChange("password")}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                   {form.password && (
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        passwordStrength <= 1
                          ? "#f44336"
                          : passwordStrength === 2
                          ? "#ff9800"
                          : passwordStrength === 3
                          ? "#ffeb3b"
                          : "#4caf50",
                      mt: 0.5,
                      fontWeight: 500,
                    }}
                  >
                    {["Weak", "Medium", "Good", "Strong"][passwordStrength]}
                  </Typography>
                )}
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                <TextField
                  label="Administrator Name"
                  value={form.adminName}
                  onChange={handleChange("adminName")}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
                 <TextField
                  label="Roll Number (Unique Id)"
                  value={form.rollnumber}
                  onChange={handleChange("rollnumber")}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Administrator Email"
                  type="email"
                  value={form.adminEmail}
                  onChange={handleChange("adminEmail")}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Create Password"
                  type={showPassword ? "text" : "password"}
                  value={form.adminPassword}
                  onChange={handlePasswordChange("adminPassword")}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {form.adminPassword && (
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        passwordStrength <= 1
                          ? "#f44336"
                          : passwordStrength === 2
                          ? "#ff9800"
                          : passwordStrength === 3
                          ? "#ffeb3b"
                          : "#4caf50",
                      mt: 0.5,
                      fontWeight: 500,
                    }}
                  >
                    {["Weak", "Medium", "Good", "Strong"][passwordStrength]}
                  </Typography>
                )}
                <TextField
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.adminConfirmPassword}
                  onChange={handleChange("adminConfirmPassword")}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="flex flex-col gap-4">
                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Institution Name:</span>
                    <span>{form.fullname}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span>{form.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subdomain:</span>
                    <span>{form.subdomain}.educonnect.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Admin Name:</span>
                    <span>{form.adminName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Admin Email:</span>
                    <span>{form.adminEmail}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleOutline color="success" />
                  <Typography variant="subtitle1">You're ready to submit!</Typography>
                </div>
                <Typography variant="body2" color="textSecondary">
                  A confirmation email will be sent with your instance details.
                </Typography>
              </div>
            )}

            {/* Navigation Buttons */}
            <CardActions sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
              {step > 1 && (
                <Button variant="outlined" onClick={() => {
                  setStep(step - 1) 
                setisSubmit(false)
                }}>
                  Back
                </Button>
              )}
              { issubmit ?  <Loader className="animate-spin" size={16} />:<Button disabled={issubmit} variant="contained" type="submit">
                {step < 3 ? "Next" : "Finish"}
              </Button>}
            </CardActions>
          </form>
        </CardContent>
        {
          step == 1 && (
            <Box className="flex justify-center border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <button onClick={()=>navigate('/login')} className="text-primary hover:underline text-blue-500">
                Log in
              </button>
            </p>
          </Box>
          )
        }
      </Card>
    </div></>
  );
}