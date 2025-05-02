import { z } from 'zod';

export const uniqueSubdoamin = z.object({
  subdomain: z
    .string({ required_error: "Subdomain is required" })
    .min(1, { message: "Subdomain must be at least 1 character" })
    .max(100, { message: "Subdomain must be at most 100 characters" }),
});

export const signupSchema = z.object({
    fullname: z
      .string({ required_error: "Fullname is required" })
      .min(1, { message: "Fullname must be at least 1 character" })
      .max(100, { message: "Fullname must be at most 100 characters" }),

    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Please enter a valid email address" }),

    password: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" })
      .max(100, { message: "Password must be at most 100 characters" }),

    subdomain: z
      .string({ required_error: "Subdomain is required" })
      .min(1, { message: "Subdomain must be at least 1 character" })
      .max(100, { message: "Subdomain must be at most 100 characters" }),
    type: z
      .string({ required_error: "Type is required" })
      .min(1, { message: "Type must be at least 1 character" })
      .max(100, { message: "Type must be at most 100 characters" })
      .default("university"),

    adminEmail: z
      .string({ required_error: "Admin email is required" })
      .email({ message: "Please enter a valid admin email address" }),

    adminPassword: z
      .string({ required_error: "Admin password is required" })
      .min(6, { message: "Admin password must be at least 6 characters" })
      .max(100, { message: "Admin password must be at most 100 characters" }),
    
    adminConfirmPassword: z
      .string({ required_error: "Admin confirm password is required" })
      .min(6, { message: "Admin confirm password must be at least 6 characters" })
      .max(100, { message: "Admin confirm password must be at most 100 characters" }),
    
    adminName: z
      .string({ required_error: "Name is required" })
      .min(1, { message: "Name must be at least 1 character" })
      .max(100, { message: "Name must be at most 100 characters" }),

    publickey: z.string().optional(), 
    rollnumber:z.string() 
});

export const loginSchema = z.object({
  fullname: z
    .string({ required_error: "Fullname is required" })
    .min(1, { message: "Fullname must be at least 1 character" })
    .max(100, { message: "Fullname must be at most 100 characters" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Please enter a valid email address" }),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100, { message: "Password must be at most 100 characters" }),
});

export const updateInstituteProfileSchema = z.object({
  fullname: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  type: z.enum(['school', 'university', 'other'], {
    errorMap: () => ({ message: 'Invalid institution type' }),
  }),
  subdomain: z.string().min(1, 'Subdomain is required'),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  
})
