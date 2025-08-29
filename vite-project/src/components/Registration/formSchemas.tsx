import { z } from "zod";

export const loginSchema = z.object({
  phone_number: z.string().min(10).max(15),
  password: z
    .string()
    .min(6, { message: "Password must be longer than 6 characters" }),
});

export const registerBusinessSchema = z.object({
  business_name: z.string().min(2).max(100),
  phone_number: z.string().min(10).max(15),
  role: z.string().optional().default("BUSINESS"),
  password: z
    .string()
    .min(6, { message: "Password must be longer than 6 characters" }),
});

export const registerCustomerSchema = z.object({
  phone_number: z.string().min(10).max(15),
  role: z.string().optional().default("CUSTOMER"),
  password: z
    .string()
    .min(6, { message: "Password must be longer than 6 characters" }),
});

export type LoginFormType = z.infer<typeof loginSchema>;
export type RegisterBusinessFormType = z.infer<typeof registerBusinessSchema>;
export type RegisterCustomerFormType = z.infer<typeof registerCustomerSchema>;
