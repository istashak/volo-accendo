"use client";

import React, { useState } from "react";
import {
  Contact,
  ContactValidationSchema,
  ContactVerificationStatus,
} from "../models/domain/contact";
import { z } from "zod";

type ContactFormData = {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  companyName: string | null;
  message: string;
  policyAgreed: boolean;
};

const initialState: ContactFormData = {
  email: "",
  phoneNumber: "",
  firstName: "",
  lastName: "",
  companyName: null,
  message: "",
  policyAgreed: false,
};

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(initialState);
  const [validatedContact, setValidatedContact] = useState<Contact | null>(
    null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (event: React.ChangeEvent<HTMLFormElement>) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error when user starts typing
  };

  const validateForm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // if (!formData.policyAgreed) {
    //   setErrors({
    //     policyAgreed:
    //       "You must agree to the Terms of Service and Privacy Policy.",
    //   });
    //   return false;
    // }

    try {
      setValidatedContact(
        ContactValidationSchema.parse({
          ...formData,
          verificationStatus: "pending",
        })
      );
      return true;
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
      return false;
    }
  };

  const createContact = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const apiUrl = process.env.NEXT_PUBLIC_VOLO_ACCENDO_API || "";

    event.preventDefault();

    try {
      console.log("Attempting to create contact:", validatedContact);
      console.log(`https://${apiUrl}/contacts`);
      const res = await fetch(`https://${apiUrl}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedContact),
      });

      if (!res.ok) {
        throw new Error(`Failed to submit contact. Status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Contact submitted successfully:", data);
      //   return { message: "success" };
    } catch (error) {
      console.error("Error submitting contact:", error);
      //   return { message: "error" };
    }
  };

  return (
    <>
      {!validatedContact && (
        <form className="space-y-3 flex-1" onChange={handleInputChange}>
          <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
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
                    required
                  />
                </label>
                {errors.lastName && (
                  <p className="mt-2 text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>
              <div className="mt-4">
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
                  />
                </label>
                {errors.companyName && (
                  <p className="mt-2 text-red-500 text-sm">{errors.companyName}</p>
                )}
              </div>
              <div className="mt-4">
                <label className="form-control">
                  <div className="label">
                    <span className="label-text">Message</span>
                  </div>
                  <textarea
                    className={`textarea  h-32 w-1/4 ${
                      errors.message ? "border-red-500" : "textarea-bordered"
                    }`}
                    placeholder="What are you looking for?"
                    id="message"
                    name="message"
                  ></textarea>
                </label>
                {errors.message && (
                  <p className="mt-2 text-red-500 text-sm">{errors.message}</p>
                )}
              </div>
            </div>
            <div>
              <div className="mt-4 flex space-x-2">
                <input type="checkbox" id="policyAgreed" name="policyAgreed" />
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
            <button
              className="btn btn-primary mt-4 w-1/6"
              onClick={validateForm}
            >
              Done
            </button>
            <div className="flex h-8 items-end space-x-1">
              {/* Add form errors here */}
            </div>
          </div>
        </form>
      )}
      {validatedContact && (
        <div>
          <h2>Review Your Data</h2>
          <p>Email: {formData.email}</p>
          <p>Phone Number: {formData.phoneNumber}</p>
          <p>First Name: {formData.firstName}</p>
          <p>Last Name: {formData.lastName}</p>
          <p>Company Name: {formData.companyName || "N/A"}</p>
          <p>Message: {formData.message}</p>
          <button
            className="btn btn-primary mt-4 w-1/6"
            onClick={createContact}
          >
            Confirm
          </button>
        </div>
      )}
    </>
  );
}
