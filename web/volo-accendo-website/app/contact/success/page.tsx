"use client";

import { useContactStore } from "@/app/stores/contact-store";

export default function Page() {
  const focusedContact = useContactStore((state) => state.focusedContact);

  console.log("focusedContact", focusedContact);

  return (
    <>
      {focusedContact ? (
        <div>
          <p className="mb-4 font-semibold">
            {`Thank you ${focusedContact.firstName}, your contact information was successfully received.`}
          </p>
          <p className="mb-4 font-semibold">{`Please complete this contact by checking your inbox (${focusedContact.email}) for a verification email.`}</p>
          <p className="font-semibold">After verification we will reach out shortly.</p>
        </div>
      ) :
      (
        <p className="mb-4 font-semibold">Error receiving the focusedContact.</p>
      )}
    </>
  );
}
