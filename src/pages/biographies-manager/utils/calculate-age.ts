import dayjs from 'dayjs';

export const calculateAge = (dateOfBirth?: string): string | null => {
  if (!dateOfBirth) return '-';

  const datesOfBirth = dateOfBirth.split(',').map((date) => date.trim());
  const ages: number[] = [];

  datesOfBirth.forEach((dateString) => {
    const birthDate = dayjs(dateString);
    if (birthDate.isValid()) {
      const now = dayjs();
      const yearsDiff = now.diff(birthDate, 'years');
      ages.push(yearsDiff);
    }
  });

  return ages.join(' | ');
};
