import { useState, useEffect } from 'react';
import { format } from 'timeago.js';

export const MessageTimestamp = ({ createdAt }) => {
  const [timeAgo, setTimeAgo] = useState(format(createdAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(format(createdAt));
    }, 60000); 

    return () => clearInterval(interval); 
  }, [createdAt]);

  return <span className="text-xs">{timeAgo}</span>;
};
