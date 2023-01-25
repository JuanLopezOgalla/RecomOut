import React, { FC, useState, useEffect } from 'react';

interface TimerProps {
  initialSeconds: number;
  handleCycle: () => void;
}

const Timer: FC<TimerProps> = (props: TimerProps) => {
  const { initialSeconds, handleCycle } = props;

  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    let timerInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        setSeconds(initialSeconds);
        handleCycle();
      }
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  });

  return <div className="w-4">{seconds}</div>;
};

export default Timer;
