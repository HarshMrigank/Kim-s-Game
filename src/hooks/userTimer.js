
import { useEffect, useState } from "react";

export default function useTimer(initialSeconds, isRunning) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) {
      return;
    }

    const timerId = setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(timerId);
  }, [isRunning, secondsLeft]);

  return {
    secondsLeft,
    setSecondsLeft,
    isFinished: secondsLeft <= 0,
  };
}
