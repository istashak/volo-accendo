import React, { useState } from "react";
import { ContactValidationSchema } from "../models/domain/contact";
import { z } from "zod";
import { useContactStore } from "@/app/stores/contact-store";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";

export type ContactFormData = {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  companyName: string | null;
  message: string;
  policyAgreed: boolean;
};

export function ContactForm() {
  // const contactFormData = useContactStore((state) => state.contactFormData);
  // const setContactFormData = useContactStore(
  //   (state) => state.setContactFormData
  // );
  // const newContact = useContactStore((state) => state.newContact);
  // const setNewContact = useContactStore((state) => state.setNewContact);

  const [contactFormData, setContactFormData, setNewContact] = useContactStore(
    useShallow((state) => [
      state.contactFormData,
      state.setContactFormData,
      state.setNewContact,
    ])
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setContactFormData({
      ...contactFormData,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error when user starts typing
  };

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setContactFormData({
      ...contactFormData,
      [name]: value,
    });
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error when user starts typing
  };

  const validateForm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      console.log("contactFormData: ", contactFormData);
      setNewContact(
        ContactValidationSchema.parse({
          ...contactFormData,
          verificationStatus: "pending",
        })
      );
      router.push("/contact/confirm");
    } catch (e) {
      if (e instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        e.errors.forEach((error) => {
          if (error.path[0]) {
            newErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  // useEffect(() => {
  //   // Optionally log the error to an error reporting service
  //   console.error("newContact", newContact);
  //   if(newContact) {
  //     router.push("/contact/confirm");
  //   }
  // }, [newContact]);

  return (
    <form className="space-y-3 flex-1">
      <div className="flex-1 rounded-lg bg-gray-50 p-6">
        <div className="w-full">
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Email</span>
              </div>
              <input
                className={`input w-full max-w-xs ${
                  errors.email ? "border-red-500" : "input-bordered"
                }`}
                id="email"
                type="email"
                name="email"
                placeholder="Email"
                value={contactFormData.email}
                onChange={handleInputChange}
                required
              />
            </label>
            {errors.email && (
              <p className="mt-2 text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Phone Number</span>
              </div>
              <input
                className={`input w-full max-w-xs ${
                  errors.phoneNumber ? "border-red-500" : "input-bordered"
                }`}
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={contactFormData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </label>
            {errors.phoneNumber && (
              <p className="mt-2 text-red-500 text-sm">{errors.phoneNumber}</p>
            )}
          </div>
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">First Name</span>
              </div>
              <input
                className={`input w-full max-w-xs ${
                  errors.firstName ? "border-red-500" : "input-bordered"
                }`}
                id="firstName"
                type="text"
                name="firstName"
                placeholder="First Name"
                value={contactFormData.firstName}
                onChange={handleInputChange}
                required
              />
            </label>
            {errors.firstName && (
              <p className="mt-2 text-red-500 text-sm">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Last Name</span>
              </div>
              <input
                className={`input w-full max-w-xs ${
                  errors.lastName ? "border-red-500" : "input-bordered"
                }`}
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={contactFormData.lastName}
                onChange={handleInputChange}
                required
              />
            </label>
            {errors.lastName && (
              <p className="mt-2 text-red-500 text-sm">{errors.lastName}</p>
            )}
          </div>
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Company Name (Optional)</span>
              </div>
              <input
                className={`input w-full max-w-xs ${
                  errors.companyName ? "border-red-500" : "input-bordered"
                }`}
                id="companyName"
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={contactFormData?.companyName ?? ""}
                onChange={handleInputChange}
              />
            </label>
            {errors.companyName && (
              <p className="mt-2 text-red-500 text-sm">{errors.companyName}</p>
            )}
          </div>
          <div>
            <label className="form-control">
              <div className="label">
                <span className="label-text">Message</span>
              </div>
              <textarea
                className={`textarea h-80 w-3/4 ${
                  errors.message ? "border-red-500" : "textarea-bordered"
                }`}
                id="message"
                name="message"
                placeholder="What are you looking for?"
                value={contactFormData.message}
                onChange={handleTextAreaChange}
              ></textarea>
            </label>
            {errors.message && (
              <p className="mt-2 text-red-500 text-sm">{errors.message}</p>
            )}
          </div>
        </div>
        <div>
          <div className="mt-4 flex space-x-2">
            <input
              type="checkbox"
              id="policyAgreed"
              name="policyAgreed"
              checked={contactFormData.policyAgreed}
              onChange={handleInputChange}
            />
            <label className="label">
              <span className="label-text">
                Accept our Terms of Service and Privacy Policy
              </span>
            </label>
          </div>
          {errors.policyAgreed && (
            <p className="text-red-500 text-sm">{errors.policyAgreed}</p>
          )}
        </div>
        <button className="btn btn-primary mt-4 w-1/6" onClick={validateForm}>
          Next
        </button>
      </div>
    </form>
  );
}
