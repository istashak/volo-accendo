import { Contact } from "@/models/domain/contact";
import { useContactStore } from "@/stores/contact-store";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/shallow";

export type ContactCreationStatus =
  | "pending"
  | "creating"
  | "success"
  | "error";

export type ContactCreationState = {
  status: ContactCreationStatus;
  message: string;
};

const useContactConfirmationController = () => {
  const [contactCreationState, setContactCreationState] =
    useState<ContactCreationState>({ status: "pending", message: "" });
  const router = useRouter();
  // const newContact = useContactStore((state) => state.newContact);
  // const clearNewContact = useContactStore((state) => state.clearNewContact);
  // const resetContactFormData = useContactStore(
  //   (state) => state.resetContactFormData
  // );
  // const setFocusedContact = useContactStore((state) => state.setFocusedContact);

  const [newContact, clearNewContact, resetContactFormData, setFocusedContact] = useContactStore(
    useShallow((state) => [state.newContact, state.clearNewContact, state.resetContactFormData, state.setFocusedContact])
  );

  console.log("useContactConfirmationController newContact 9:", newContact);

  const onContactCreateConfirm = useCallback(async (newContact: Contact) => {
    setContactCreationState({ status: "creating", message: "Processing..." });
    const apiUrl = process.env.NEXT_PUBLIC_VOLO_ACCENDO_API || "";

    try {
      console.log("Attempting to create contact:", newContact);
      console.log(`https://${apiUrl}/contacts`);
      const res = await fetch(`https://${apiUrl}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContact),
      });

      if (!res.ok) {
        throw new Error(`Failed to submit contact. Status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Contact submitted successfully:", data);
      
      resetContactFormData();
      setFocusedContact(newContact);
      router.replace("/contact/success");
      clearNewContact();
      setContactCreationState({
        status: "success",
        message: "You've successfully sent your contact message.",
      });
    } catch (error) {
      console.error("Error submitting contact:", error);
      setContactCreationState({ status: "error", message: `${error}` });
    }
  }, []);

  const goBack = () => {
    router.back();
  };

  return {
    newContact,
    contactCreationState,
    onContactCreateConfirm,
    goBack,
  };
};

export default useContactConfirmationController;
