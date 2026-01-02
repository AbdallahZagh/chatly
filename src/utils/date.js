import { format, formatDistanceToNow, isToday } from 'date-fns';

export const formatMessageTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return isToday(d) ? format(d, 'p') : format(d, 'MMM d, p');
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};