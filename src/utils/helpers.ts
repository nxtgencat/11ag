export function generateId(prefix = 'm'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

export function searchContactsAndMessages(
  query: string, 
  contacts: import('../types').Contact[],
  messagesByChat: Record<string, import('../types').Message[]>
) {
  if (!query.trim()) return contacts;
  const q = query.toLowerCase().trim();

  return contacts.filter(contact => {
    // Check name or phone
    if (contact.name.toLowerCase().includes(q) || contact.phone.toLowerCase().includes(q)) {
      return true;
    }
    // Check about
    if (contact.about.toLowerCase().includes(q)) {
      return true;
    }
    // Check messages in this chat
    const messages = messagesByChat[contact.id] || [];
    return messages.some(m => m.text?.toLowerCase().includes(q));
  });
}
