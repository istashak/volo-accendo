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
  email: z.string().email({ message: "Please add a valid email address."}),
  phoneNumber: z.string().min(10, "Please add a valid 10 digit phone number."),
  firstName: z.string().min(1, "Your first name is a required field."),
  lastName: z.string().min(1, "Your last name is a required field."),
  companyName: z.string().nullable(),
  message: z.string().min(20, "Please add a short description of your technological needs."),
  policyAgreed: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms of Service and Privacy Policy.",
  }),
  verificationStatus: z.enum(["pending", "verified"]),
});
