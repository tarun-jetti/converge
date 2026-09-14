import {z} from "zod";
export const registerSchema = z.object({
    name :z.string().trim().min(2,{message:"Name must be atleast two characters long"}).max(20,{message:"name must not exceed 20 characters"}),
    email :z.string().trim().toLowerCase().email({message:"Please provide valid Email adress"}),
    password :z.string().min(8,{message:"password should be atleast 8 characters long"}).max(50,{message:"password must not exceed 50 characters"})
});
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Please provide a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' }),
});
export type RegisterInput =z.infer< typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
