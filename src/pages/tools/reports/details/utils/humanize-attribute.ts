export const humanizeAttribute = (attributeName: string) => {
  return (
    attributeName
      // Split camelCase and convert to words with spaces
      .replace('_', ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // Capitalize the first letter of each word
      .replace(/(^|\s)\S/g, (match) => match.toUpperCase())
  );
};
