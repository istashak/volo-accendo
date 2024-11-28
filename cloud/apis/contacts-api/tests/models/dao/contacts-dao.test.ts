import { Contact } from "../../../src/models";
import { ContactsDao } from "../../../src/models/dao";

describe("ContactDao", () => {
  test("Returning a Contacts object from the toJson function.", () => {
    const contact: Contact = {
      email: "foo@test.com",
      phoneNumber: "(561) 867-5309",
      firstName: "Jannie",
      lastName: "Somegal",
      companyName: "Acme Inc.",
      message: "Jannie don't you lose that number!",
      verificationStatus: "pending",
    };
    const contactsDao = new ContactsDao(contact);
    expect(contactsDao.toJson()).toStrictEqual(contact);
  });
});
