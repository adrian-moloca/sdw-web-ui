export const scrollToDiv = (targetDivId: string | null) => {
  if (!targetDivId) return;

  const element = document.getElementById(targetDivId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
