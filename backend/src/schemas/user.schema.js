import { z } from "zod";

export const userSignupSchema = z.object({
  name: z
    .string({ required_error: "Full name is required" })
    .min(1, "Full name must be at least 1 character")
    .max(100, "Full name must be at most 100 characters"),

  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email address"),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),

  rollnumber: z.string().optional().or(z.literal("0")),

  role: z.enum(["admin", "teacher", "student", "parent"], {
    required_error: "Role is required",
  }),
  avatar: z.string().optional(),

  subdomain: z.string({ required_error: "Subdomain is required" }),

  batch: z.string().optional(),
  department: z.string().optional(),
  parentofname: z.string().optional(),
  parentofemail:z.string().optional(),
  
}).refine((data) => {
  if (data.role === "student" && !data.batch) return false;
  if (data.role === "teacher" && !data.department) return false;
  if (data.role === "parent" && !data.parentofname && !data.parentofname ) return false;
  return true;
}, {
  message: "Missing required field for selected role",
});

export const userLoginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email address"),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),

   role: z.enum(["admin", "teacher", "student", "parent"], {
      required_error: "Role is required",
    }),
    subdomain: z.string({ required_error: "Subdomain is required" }),
})

export const publicKeyCheck = z.object({
  userId: z.string({ required_error: "User ID is required" }),
  publicKey: z.string({ required_error: "Public key is required" }),
})

export const userPasswordUpdateSchema = z.object({
  role: z.enum(["admin", "teacher", "student", "parent"], {
    required_error: "Role is required",
  }),
  subdomain: z.string({ required_error: "Subdomain is required" }),
  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email address"),

  oldPassword: z
    .string({ required_error: "Old password is required" })
    .min(6, "Old password must be at least 6 characters")
    .max(100, "Old password must be at most 100 characters"),

  newPassword: z
    .string({ required_error: "New password is required" })
    .min(6, "New password must be at least 6 characters")
    .max(100, "New password must be at most 100 characters"),

  confirmPassword: z
    .string({ required_error: "Confirm password is required" })
    .min(6, "Confirm password must be at least 6 characters")
    .max(100, "Confirm password must be at most 100 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New password and confirm password do not match",
})