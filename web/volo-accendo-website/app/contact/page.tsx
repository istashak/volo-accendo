import { ContactForm } from "../components/contact-form";

export default function ContactPage() {
  return (
    <div>
      <p className="mb-4 font-semibold">{`If you're interested in hearing more about our services, let's connect...`}</p>
      <ContactForm />
    </div>
  );
}
