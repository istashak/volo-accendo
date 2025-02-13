"use client";

import { ContactForm } from "../components/contact-form";

export default function Page() {
  return (
    <div>
      <p className="mb-4 text-center text-2xl">{`If you're interested in hearing more about Volo Accendo's services, and how we may meet your technological needs, let's connect.`}</p>
      <ContactForm />
    </div>
  );
}
