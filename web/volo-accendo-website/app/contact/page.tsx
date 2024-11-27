import { Contact, ContactForm } from "../ui";
import { ContactFormII } from "../ui/contact-form-ii";
import useContactViewController from "./contact-view-controller";

export default async function ContactPage() {
  // const { handleSubmitContact, status } = useContactViewController();

  return (
    <div className="">
      <p>{`If you're interesting in hearing more we'd love to connect...`}</p>
      <ContactFormII />
    </div>
  );
}
