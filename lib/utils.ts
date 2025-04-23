import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertUTCtoIST = (utcDateString: string): string => {
  // Create a Date object from the UTC string
  const utcDate = new Date(utcDateString);

  // Convert UTC to IST (Indian Standard Time, UTC +5:30)
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    // weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };

  const istDate = utcDate.toLocaleString('en-GB', options);
  
  return istDate;
}
