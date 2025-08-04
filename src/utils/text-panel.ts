export const formatText = (text: string) => {
  if (!text) return '';

  return text.replace('{REQUEST-FORM}', '/access-request');
};
