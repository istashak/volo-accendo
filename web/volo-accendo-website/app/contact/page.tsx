"use client";

import { ContactForm } from "@/ui/components";

export default function Page() {
  return (
    <div>
      <p className="mb-4 text-center text-2xl rounded-lg p-6 shadow-lg">{`If you're interested in hearing more about Volo Accendo's services, and how we may meet your technological needs, let's connect.`}</p>
      <ContactForm />
    </div>
  );
}
