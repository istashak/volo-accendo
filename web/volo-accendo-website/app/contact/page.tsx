import { ContactForm } from "../components/contact-form"

export default async function ContactPage() {
  return (
    <div className="">
      <p>{`If you're interested in hearing more about our services, let's connect...`}</p>
      <ContactForm />
    </div>
  );
}
