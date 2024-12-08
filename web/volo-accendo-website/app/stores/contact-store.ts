import { create } from "zustand";
import { Contact } from "../models/domain/contact";
import { ContactFormData } from "../components/contact-form";

interface ContactStore {
  contactFormData: ContactFormData;
  setContactFormData: (contactFormData: ContactFormData) => void;
  newContact: Contact | null;
  setNewContact: (newContact: Contact) => void;
  clearNewContact: () => void;
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

export const useContactStore = create<ContactStore>((set) => ({
  contactFormData: initialState,
  setContactFormData: (contactFormData) => set({ contactFormData }),
  newContact: null,
  setNewContact: (newContact) => set({ newContact }),
  clearNewContact: () => set({ newContact: null }),
}));
