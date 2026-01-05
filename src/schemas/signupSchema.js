import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8),
  username: z.string().min(3, "Username must be at least 3 characters").regex(/^[a-zA-Z0-9_\-]+$/, "Username may contain letters, numbers, underscore and hyphen"),
  displayName: z.string().min(1, "Display name is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
