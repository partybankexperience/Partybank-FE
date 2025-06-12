
// Utility function to format date
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Utility function to format time
export const formatTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(':');
  const time = new Date();
  time.setHours(parseInt(hours), parseInt(minutes));
  return time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Utility function to create time range display
export const formatTimeRange = (startTime: string, endTime?: string) => {
  const formattedStartTime = formatTime(startTime);
  const formattedEndTime = endTime ? formatTime(endTime) : null;
  
  return formattedEndTime 
    ? `${formattedStartTime} - ${formattedEndTime}` 
    : formattedStartTime;
};

// Utility function to format date and time together
export const formatDateTime = (dateString: string, startTime: string, endTime?: string) => {
  const formattedDate = formatDate(dateString);
  const timeDisplay = formatTimeRange(startTime, endTime);
  
  return {
    date: formattedDate,
    time: timeDisplay,
    full: `${formattedDate} ${timeDisplay}`
  };
};

// Convert ISO date string to yyyy-MM-dd format for date inputs
export const convertISOToDateInput = (isoString: string) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toISOString().split('T')[0];
};

// Convert yyyy-MM-dd format to ISO string for backend
export const convertDateInputToISO = (dateString: string, timeString: string = '00:00') => {
  if (!dateString) return '';
  return new Date(`${dateString}T${timeString}`).toISOString();
};
