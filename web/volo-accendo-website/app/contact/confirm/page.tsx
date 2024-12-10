"use client";

import React from "react";
import useContactConfirmationController from "./contact-confirmation-controller";

export default function Confirm() {
  const { newContact, contactCreationState, onContactCreateConfirm, goBack } =
    useContactConfirmationController();

  const buttonsDisabled = contactCreationState.status === "creating";

  return (
    <>
      {contactCreationState.status === "creating" && (
        <div className="spinner-overlay">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
      {newContact ? (
        <div>
          <h2 className="mb-4 font-bold text-lg">
            Review Your Contact Information
          </h2>
          <p>
            {newContact.firstName} {newContact.lastName}
          </p>
          <p>{newContact.email}</p>
          <p>{newContact.phoneNumber}</p>
          {newContact.companyName && <p>{newContact.companyName}</p>}
          <p className="bg-slate-100 p-1 mt-4 whitespace-pre-line">
            {newContact.message}
          </p>
          <div className="space-x-2">
            <button
              className="btn btn-primary mt-4 w-1/6"
              disabled={buttonsDisabled}
              onClick={goBack}
            >
              Edit
            </button>
            <button
              className="btn btn-primary mt-4 w-1/6"
              disabled={buttonsDisabled}
              onClick={() => onContactCreateConfirm(newContact)}
            >
              Confirm
            </button>
          </div>
          {contactCreationState.status === "error" && (
            <div>
              <p className="mt-4 font-bold">`There was an error processing your contact info: ${contactCreationState.message}`</p>
              <p className="mt-4 font-bold">Please try again.</p>
            </div>
          )}
        </div>
      ) : (
        <p>There was an error reading the contact information!</p>
      )}
    </>
  );
}
