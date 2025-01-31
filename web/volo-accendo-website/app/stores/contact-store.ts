import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Contact } from "../models/domain/contact";
import { ContactFormData } from "../components/contact-form";

interface ContactStore {
  contactFormData: ContactFormData;
  setContactFormData: (contactFormData: ContactFormData) => void;
  resetContactFormData: () => void;
  newContact: Contact | null;
  setNewContact: (newContact: Contact) => void;
  clearNewContact: () => void;
  focusedContact: Contact | null;
  setFocusedContact: (focusedContact: Contact) => void;
}

const initialState: ContactFormData = {
  email: "",
  phoneNumber: "",
  firstName: "",
  lastName: "",
  companyName: null,
  message: "",
  policyAgreed: false,
};

export const useContactStore = create(
  persist<ContactStore>(
    (set) => ({
      contactFormData: initialState,
      setContactFormData: (contactFormData) => set({ contactFormData }),
      resetContactFormData: () => set({ contactFormData: initialState }),
      newContact: null,
      setNewContact: (newContact) => {
        console.log("useContactStore setNewContact to newContact", newContact);
        set({ newContact });
      },
      clearNewContact: () => set({ newContact: null }),
      focusedContact: null,
      setFocusedContact: (focusedContact) => set({ focusedContact }),
    }),
    { name: "contact-store" }
  )
);
