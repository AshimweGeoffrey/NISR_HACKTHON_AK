import { useEffect, useState } from "react";

const ML_PREDICTION_URL = "https://nisr-hackthon-ak-p9n3.vercel.app/";

export default function MLRedirectNotice() {
  const [visible, setVisible] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(45);

  useEffect(() => {
    function handler() {
      setVisible(true);
      setSecondsLeft(45);
    }

    window.addEventListener(
      "open-ml-prediction-wait",
      handler as EventListener
    );

    return () =>
      window.removeEventListener(
        "open-ml-prediction-wait",
        handler as EventListener
      );
  }, []);

  useEffect(() => {
    if (!visible) return;
    // countdown every second
    const interval = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    // immediate wake ping (image beacon + fetch no-cors)
    try {
      const img = new Image();
      img.src = ML_PREDICTION_URL + "?wake=1&ts=" + Date.now();
    } catch (e) {
      // ignore
    }
    try {
      fetch(ML_PREDICTION_URL + "?wake=1", { mode: "no-cors" }).catch(() => {});
    } catch (e) {}

    // poll every 5s to keep waking the deployment while counting down
    const poll = setInterval(() => {
      try {
        const img = new Image();
        img.src = ML_PREDICTION_URL + "?wake=1&ts=" + Date.now();
      } catch (e) {}
      try {
        fetch(ML_PREDICTION_URL + "?wake=1", { mode: "no-cors" }).catch(
          () => {}
        );
      } catch (e) {}
    }, 5000);

    const timeout = setTimeout(() => {
      window.location.href = ML_PREDICTION_URL;
    }, 45000);

    return () => {
      clearInterval(interval);
      clearInterval(poll);
      clearTimeout(timeout);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="ml-wait-overlay">
      <div className="ml-wait-card">
        <h3>Preparing ML Prediction</h3>
        <p>
          The prediction API is starting up. Please wait {secondsLeft} second
          {secondsLeft !== 1 ? "s" : ""} — you'll be redirected when ready.
        </p>
        <p className="muted">If nothing happens after 45s, click here:</p>
        <a href={ML_PREDICTION_URL} className="nav-link">
          Go to ML Prediction now
        </a>
      </div>
    </div>
  );
}
