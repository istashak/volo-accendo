"use client";

import React, { useCallback, useState } from "react";
import { Contact } from "../ui";

type SendContactStatus = "pending" | "sending" | "success" | "error";

const apiUrl = process.env.VOLO_ACCENDO_API || "";

const useContactViewController = () => {
  const [status, setStatus] = useState<SendContactStatus>("pending");

  const handleSubmitContact = useCallback(async (contact: Contact) => {
    console.log("handleSubmit called");

    try {
      setStatus("sending");
      console.log(`https://${apiUrl}/contacts`);
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
      setStatus("success");
    } catch (error) {
      console.error("Error submitting contact:", error);
      setStatus("error");
    }
  }, []);

  return {
    handleSubmitContact,
    status,
  };
};

export default useContactViewController;
