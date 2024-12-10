"use client";

import { useContactStore } from "@/app/stores/contact-store";

export default function Page() {
  const focusedContact = useContactStore((state) => state.focusedContact);

  console.log("focusedContact", focusedContact);

  return (
    <div>
      <p className="mb-4 font-semibold">{focusedContact?.email}</p>
    </div>
  );
}
