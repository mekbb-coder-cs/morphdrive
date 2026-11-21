import { z } from "zod";

export const RegisterUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(25).regex(/^[a-zA-Z0-9_-]+$/, {
    message: "Username may only contain letters, numbers, underscores, and dashes",
  }),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;

export const LoginUserSchema = z.object({
  login: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});
export type LoginUserInput = z.infer<typeof LoginUserSchema>;

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string(),
  createdAt: z.string().or(z.date()),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;
