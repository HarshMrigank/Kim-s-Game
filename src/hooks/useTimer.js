import { useEffect, useState, useRef, useCallback } from "react";

/**
 * Robust countdown timer hook using absolute timestamps.
 * Immune to drift, tab switching, and browser suspension.
 */
export default function useTimer({
  initialSeconds = 10,
  isRunning = true,
  deadlineTimestamp = null,
  onExpire = null,
} = {}) {
  // Compute initial deadline
  const [deadline, setDeadline] = useState(() => {
    if (deadlineTimestamp && deadlineTimestamp > Date.now()) {
      return deadlineTimestamp;
    }
    return Date.now() + initialSeconds * 1000;
  });

  const [secondsLeft, setSecondsLeft] = useState(() => {
    const target = deadlineTimestamp || (Date.now() + initialSeconds * 1000);
    return Math.max(0, Math.ceil((target - Date.now()) / 1000));
  });

  const onExpireRef = useRef(onExpire);
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const hasExpiredRef = useRef(false);

  // Allow resetting timer to a new duration or deadline
  const resetTimer = useCallback((newSeconds, newDeadline = null) => {
    hasExpiredRef.current = false;
    const nextDeadline = newDeadline || (Date.now() + newSeconds * 1000);
    setDeadline(nextDeadline);
    setSecondsLeft(Math.max(0, Math.ceil((nextDeadline - Date.now()) / 1000)));
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    function checkTime() {
      const remainingMs = deadline - Date.now();
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

      setSecondsLeft(remainingSec);

      if (remainingSec <= 0) {
        if (!hasExpiredRef.current) {
          hasExpiredRef.current = true;
          if (typeof onExpireRef.current === "function") {
            onExpireRef.current();
          }
        }
      }
    }

    checkTime();
    const interval = setInterval(checkTime, 200);

    return () => clearInterval(interval);
  }, [isRunning, deadline]);

  return {
    secondsLeft,
    deadline,
    isFinished: secondsLeft <= 0,
    resetTimer,
  };
}
