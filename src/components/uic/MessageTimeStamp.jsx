import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export const MessageTimestamp = ({ createdAt }) => {
  const [formattedTime, setFormattedTime] = useState(() => {
    const initialTime = createdAt ? new Date(createdAt) : new Date();
    return format(initialTime, "hh:mm a");
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setFormattedTime(format(new Date(), "hh:mm a"));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return <span className="text-xs ">{formattedTime}</span>;
};
