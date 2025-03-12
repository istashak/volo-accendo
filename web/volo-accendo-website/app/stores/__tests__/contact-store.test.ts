import { act, renderHook } from "@testing-library/react";
import { useContactStore } from "../contact-store";
import { Contact } from "@/models/domain";

describe("ContactStore", () => {
  beforeEach(() => {
    // Clear the store before each test
    const { result } = renderHook(() => useContactStore());
    act(() => {
      result.current.resetContactFormData();
      result.current.clearNewContact();
      result.current.setFocusedContact(null);
    });
  });

  describe("Contact Form Data", () => {
    it("should initialize with default values", () => {
      const { result } = renderHook(() => useContactStore());

      expect(result.current.contactFormData).toEqual({
        email: "",
        phoneNumber: "",
        firstName: "",
        lastName: "",
        companyName: null,
        message: "",
        policyAgreed: false,
      });
    });

    it("should update contact form data", () => {
      const { result } = renderHook(() => useContactStore());
      const newFormData = {
        email: "test@example.com",
        phoneNumber: "1234567890",
        firstName: "John",
        lastName: "Doe",
        companyName: "Test Corp",
        message: "Test message",
        policyAgreed: true,
      };

      act(() => {
        result.current.setContactFormData(newFormData);
      });

      expect(result.current.contactFormData).toEqual(newFormData);
    });

    it("should reset contact form data", () => {
      const { result } = renderHook(() => useContactStore());
      const newFormData = {
        email: "test@example.com",
        phoneNumber: "1234567890",
        firstName: "John",
        lastName: "Doe",
        companyName: "Test Corp",
        message: "Test message",
        policyAgreed: true,
      };

      act(() => {
        result.current.setContactFormData(newFormData);
        result.current.resetContactFormData();
      });

      expect(result.current.contactFormData).toEqual({
        email: "",
        phoneNumber: "",
        firstName: "",
        lastName: "",
        companyName: null,
        message: "",
        policyAgreed: false,
      });
    });
  });

  describe("New Contact", () => {
    const testContact: Contact = {
      email: "test@example.com",
      phoneNumber: "1234567890",
      firstName: "John",
      lastName: "Doe",
      companyName: "Test Corp",
      message: "Test message",
      verificationStatus: "pending",
    };

    it("should set new contact", () => {
      const { result } = renderHook(() => useContactStore());

      act(() => {
        result.current.setNewContact(testContact);
      });

      expect(result.current.newContact).toEqual(testContact);
    });

    it("should clear new contact", () => {
      const { result } = renderHook(() => useContactStore());

      act(() => {
        result.current.setNewContact(testContact);
        result.current.clearNewContact();
      });

      expect(result.current.newContact).toBeNull();
    });
  });

  describe("Focused Contact", () => {
    const testContact: Contact = {
      email: "test@example.com",
      phoneNumber: "1234567890",
      firstName: "John",
      lastName: "Doe",
      companyName: "Test Corp",
      message: "Test message",
      verificationStatus: "pending",
    };

    it("should set focused contact", () => {
      const { result } = renderHook(() => useContactStore());

      act(() => {
        result.current.setFocusedContact(testContact);
      });

      expect(result.current.focusedContact).toEqual(testContact);
    });

    it("should handle null focused contact", () => {
      const { result } = renderHook(() => useContactStore());

      act(() => {
        result.current.setFocusedContact(testContact);
        result.current.setFocusedContact(null);
      });

      expect(result.current.focusedContact).toBeNull();
    });
  });

  describe("Store Persistence", () => {
    it("should persist state changes", () => {
      const testContact: Contact = {
        email: "test@example.com",
        phoneNumber: "1234567890",
        firstName: "John",
        lastName: "Doe",
        companyName: "Test Corp",
        message: "Test message",
        verificationStatus: "pending",
      };

      // First render
      const { result, rerender } = renderHook(() => useContactStore());

      act(() => {
        result.current.setNewContact(testContact);
      });

      // Rerender to simulate component remount
      rerender();

      expect(result.current.newContact).toEqual(testContact);
    });
  });
});
