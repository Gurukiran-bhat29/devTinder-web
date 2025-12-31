export const BASE_URL = 
  location.hostname === 'localhost' 
    ? "http://localhost:7070"
    : '/api';

export const formatTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
