"use server";

import { Contact, ContactValidationSchema } from "@/models/domain/contact";

// export async function createContact(prevState: any, formData: FormData) {
//   const apiUrl = process.env.VOLO_ACCENDO_API || "";

//   // Check if the Terms of Service checkbox is checked
//   const isPolicyAgreed = formData.get("policyAgree")?.toString() === "on";
//   if (!isPolicyAgreed) {
//     return {
//       message: "error",
//       error: "You must agree to the Terms of Service before submitting.",
//     };
//   }

//   const contact: Contact = ContactValidationSchema.parse({
//     email: formData.get("email"),
//     phoneNumber: formData.get("phoneNumber"),
//     firstName: formData.get("firstName"),
//     lastName: formData.get("lastName"),
//     companyName: formData.get("companyName"),
//     message: formData.get("message"),
//     verificationStatus: "pending"
//   });

//   try {
//     console.log("Attempting to create contact:", contact);
//     console.log(`https://${apiUrl}/contacts`);
//     const res = await fetch(`https://${apiUrl}/contacts`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(contact),
//     });

//     if (!res.ok) {
//       throw new Error(`Failed to submit contact. Status: ${res.status}`);
//     }

//     const data = await res.json();
//     console.log("Contact submitted successfully:", data);
//     return { message: "success" };
//   } catch (error) {
//     console.error("Error submitting contact:", error);
//     return { message: "error" };
//   }
// }
