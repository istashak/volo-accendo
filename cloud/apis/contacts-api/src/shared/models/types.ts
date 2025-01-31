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
