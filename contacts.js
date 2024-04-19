import { error } from 'node:console';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import crypto from "node:crypto";

const contactsPath = path.resolve('db', 'contacts.json');


async function readFile(filePath) {
   const data = await fs.readFile(filePath)
    return JSON.parse(data);
}

function writeFile(filePath, data) {
  return fs.writeFile(filePath, JSON.stringify(data, undefined, 2));  
}

export async function listContacts() {
  // Повертає масив контактів.
  const contacts = await readFile(contactsPath);
  return contacts;
}

export async function getContactById(contactId) {
  // Повертає об'єкт контакту з таким id. Повертає null, якщо контакт з таким id не знайдений.
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  if (contact === undefined) {
    return null;
  }
  return contact;
}

export async function removeContact(contactId) {
  // Повертає об'єкт видаленого контакту. Повертає null, якщо контакт з таким id не знайдений.
  const contacts = await listContacts();
  const contact = await getContactById(contactId);

  if (contact === undefined) {
    return null;
  }
  const newContactList = contacts.filter((oneContact) => oneContact.id !== contactId);
  await writeFile(contactsPath, newContactList);
  return contact;
}

export async function addContact(name, email, phone) {
  // Повертає об'єкт доданого контакту (з id).
  const contacts = await listContacts();
  const newContact = {
    id: crypto.randomUUID(),
    name,
    email, 
    phone
  }
  contacts.push(newContact);
  await writeFile(contactsPath, contacts);
  return newContact;
}
