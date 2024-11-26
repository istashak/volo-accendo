import { useCallback, useState } from "react";
import { Contact, ContactForm } from "../ui";

const apiUrl = process.env.VOLO_ACCENDO_API;

type Status = "pending" | "sending" | "success" | "error";

export default async function ContactPage() {
  const [status, setStatus] = useState<Status>("pending");

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

  return (
    <div className="">
      <p>{`If you're interesting in hearing more we'd love to connect...`}</p>
      <ContactForm onSubmit={handleSubmitContact} />
      {status === "sending" && <p>Submitting...</p>}
      {status === "success" && (
        <p>Thank you for reaching out! We'll be in touch soon.</p>
      )}
      {status === "error" && <p>Error!</p>}
    </div>
  );
}
