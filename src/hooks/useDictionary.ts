import { useState } from 'react';

type Dictionary = Record<string, string>;

export const useDictionary = () => {
  const [dictionary, setDictionary] = useState<Dictionary>({});

  // Function to add or update a word
  const addOrUpdateWord = (word: string, definition: string) => {
    setDictionary((prev) => ({
      ...prev,
      [word]: definition,
    }));
  };

  // Function to delete a word
  const deleteWord = (word: string) => {
    setDictionary((prev) => {
      const newDict = { ...prev };
      delete newDict[word];
      return newDict;
    });
  };

  // Function to clear the dictionary
  const clearDictionary = () => {
    setDictionary({});
  };

  return { dictionary, addOrUpdateWord, deleteWord, clearDictionary };
};
