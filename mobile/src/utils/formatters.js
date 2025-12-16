export const formatDistance = (meters = 0) => {
  if (meters <= 0 || Number.isNaN(meters)) {
    return '0 m';
  }

  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }

  const kms = meters / 1000;
  return `${kms.toFixed(kms >= 10 ? 1 : 2)} km`;
};

export const formatDistanceImperial = (meters = 0) => {
  if (meters <= 0 || Number.isNaN(meters)) {
    return '0 mi';
  }
  const miles = meters / 1609.34;
  if (miles < 0.2) {
    return `${Math.round(miles * 5280)} ft`;
  }
  return `${miles.toFixed(miles >= 10 ? 1 : 2)} mi`;
};

export const formatDuration = (seconds = 0) => {
  if (!seconds || Number.isNaN(seconds)) {
    return '0m';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes}m`;
  }

  return `${hours}h ${minutes}m`;
};

export const formatEta = (isoString) => {
  if (!isoString) return '--:--';
  try {
    const eta = new Date(isoString);
    return eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    return '--:--';
  }
};
