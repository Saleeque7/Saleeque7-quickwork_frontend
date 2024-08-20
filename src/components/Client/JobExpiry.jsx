import React, { useEffect, useState } from 'react';

const JobExpiryCountdown = ({ expiryDate, onExpire }) => {
  const calculateTimeLeft = () => {
    const expiryTime = new Date(expiryDate).getTime();
    const currentTime = Date.now();
    const difference = expiryTime - currentTime;

    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (Object.keys(newTimeLeft).length === 0) {
        onExpire();
      }
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div>
      {timeLeft.days !== undefined ? (
        <span>
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </span>
      ) : (
        <span>Expired</span>
      )}
    </div>
  );
};

export default JobExpiryCountdown;
