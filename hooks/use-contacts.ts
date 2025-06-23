import { useContactsContext } from "./contacts-context";

export const useContacts = () => {
  const {
    contacts,
    isLoading: loading,
    error,
    refetch,
    updateContact,
    addContact,
    deleteContact,
  } = useContactsContext();

  return {
    contacts,
    loading,
    error,
    refetch,
    updateContact,
    addContact,
    deleteContact,
  };
};
