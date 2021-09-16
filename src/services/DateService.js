export const formatDate = (date = null) => {
  if (!date) {
    return false;
  }
  const [dateString, timeString] = date.toISOString().split('T');

  const [y, m,d] = dateString.split('-');

  return  `${d}.${m}.${y}`;
};
