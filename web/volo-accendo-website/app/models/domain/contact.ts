import { z } from "zod";

export type ContactVerificationStatus = "pending" | "verified";

export type Contact = {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  companyName: string | null;
  message: string;
  verificationStatus: ContactVerificationStatus;
};

export const ContactValidationSchema = z.object({
  email: z.string().min(1),
  phoneNumber: z.string().min(10),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  companyName: z.string().min(0),
  message: z.string().min(20),
  verificationStatus: z.enum(["pending", "verified"]),
});
