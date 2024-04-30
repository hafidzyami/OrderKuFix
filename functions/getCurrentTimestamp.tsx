function getCurrentTimestamp() {
    const now = new Date();
  
    // Get hours, minutes, seconds, day, month, and year
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = now.getFullYear().toString(); // Get last 2 digits of the year
  
    // Construct the timestamp string
    const timestamp = `${hours}:${minutes}:${seconds} ${day}-${month}-${year}`;
  
    return timestamp;
  }

export default getCurrentTimestamp;
  