"use client";

import React, { useState } from "react";

export type Contact = {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  companyName: string | null;
  message: string;
};

type ContactFormProps = {
  onSubmit: (contact: Contact) => void;
};

const apiUrl = process.env.VOLO_ACCENDO_API;

export const ContactForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    console.log("handleSubmit called");

    const contact: Contact = {
      email,
      phoneNumber,
      firstName,
      lastName,
      companyName: companyName.trim() ? companyName : null,
      message,
    };

    try {
      console.log(`https://${process.env.VOLO_ACCENDO_API}/contacts`)
      const res = await fetch(`https://${apiUrl}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      });

      if (!res.ok) {
        throw new Error("Failed to submit contact");
      }

      const data = await res.json();
      console.log("Contact submitted successfully:", data);
    } catch (error) {
      console.error("Error submitting contact:", error);
    }
  };

  return (
    <form className="space-y-3 flex-1" onSubmit={handleSubmit}>
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <div className="w-full">
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Email</span>
              </div>
              <input
                className="input input-bordered w-full max-w-xs"
                id="email"
                type="email"
                name="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Phone Number</span>
              </div>
              <input
                className="input input-bordered w-full max-w-xs"
                id="phone-number"
                type="tel"
                name="phone-number"
                placeholder="Phone Number"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">First Name</span>
              </div>
              <input
                className="input input-bordered w-full max-w-xs"
                id="first-name"
                type="text"
                name="first-name"
                placeholder="First Name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Last Name</span>
              </div>
              <input
                className="input input-bordered w-full max-w-xs"
                id="last-name"
                type="text"
                name="last-name"
                placeholder="Last Name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>
          </div>
          <div className="mt-4">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Company Name (Optional)</span>
              </div>
              <input
                className="input input-bordered w-full max-w-xs"
                id="company-name"
                type="text"
                name="company-name"
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </label>
          </div>
          <div className="mt-4">
            <label className="form-control">
              <div className="label">
                <span className="label-text">Message</span>
              </div>
              <textarea
                className="textarea textarea-bordered h-32 w-1/4"
                placeholder="What are you looking for?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </label>
          </div>
        </div>
        <button className="btn btn-primary mt-4 w-1/6" type="submit">
          Submit
        </button>
        <div className="flex h-8 items-end space-x-1">
          {/* Add form errors here */}
        </div>
      </div>
    </form>
  );
};
