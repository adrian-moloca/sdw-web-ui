export const extractValuesFromString = (inputString: string) => {
  let discipline = '';
  let id1 = '';
  let id2 = '';
  let gender = '';

  if (inputString) {
    const parts = inputString.split('|');
    if (parts.length >= 3) {
      discipline = parts[0];
      id1 = parts[1];
      id2 = parts[2];
      gender = parts[3];
    } else {
      console.error('Input string does not have enough parts.');
    }
  } else {
    console.error('Input string is empty.');
  }

  return {
    discipline,
    id1,
    id2,
    gender,
  };
};
