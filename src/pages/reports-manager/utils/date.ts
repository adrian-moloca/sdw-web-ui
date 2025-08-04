import dayjs from 'dayjs';

export const calculateDaysFromToday = (targetDate: Date): number => {
  // Get today's date and target date using dayjs
  const today = dayjs().startOf('day');
  const target = dayjs(targetDate).startOf('day');

  // Calculate the difference in days
  const diffInDays: number = target.diff(today, 'days');

  return diffInDays;
};
