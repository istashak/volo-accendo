"use client";

import React from "react";
import useContactConfirmationController from "./contact-confirmation-controller";

export default function Verify() {
  const { newContact, contactCreationState, onContactCreateConfirm, goBack } =
    useContactConfirmationController();

  return (
    <>
      {contactCreationState.status === "creating" && (
        <div className="spinner-overlay">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
      {newContact ? (
        <div>
          <h2>Review Your Data</h2>
          <p>Email: {newContact.email}</p>
          <p>Phone Number: {newContact.phoneNumber}</p>
          <p>First Name: {newContact.firstName}</p>
          <p>Last Name: {newContact.lastName}</p>
          <p>Company Name: {newContact.companyName || "N/A"}</p>
          <p>Message: {newContact.message}</p>
          {contactCreationState.status === "pending" && (
            <div className="space-x-2">
              <button className="btn btn-primary mt-4 w-1/6" onClick={goBack}>
                Edit
              </button>
              <button
                className="btn btn-primary mt-4 w-1/6"
                onClick={() => onContactCreateConfirm(newContact)}
              >
                Confirm
              </button>
            </div>
          )}
          {contactCreationState.status === "success" && (
            <div>
              <p>{contactCreationState.message}</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p>There was an error!</p>
        </div>
      )}
    </>
  );
}
