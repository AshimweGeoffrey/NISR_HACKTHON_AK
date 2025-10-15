import { useEffect, useState } from "react";

const DEFAULT_ML_PREDICTION_URL = "https://nisr-hackthon-ak-p9n3.vercel.app/";

export default function MLRedirectNotice() {
  const [visible, setVisible] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(45);
  const [targetUrl, setTargetUrl] = useState<string | null>(null);

  useEffect(() => {
    function handler(ev: Event) {
      const detail = (ev as CustomEvent)?.detail as any;
      const url = detail && typeof detail.url === "string" ? detail.url : null;
      setTargetUrl(url);
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
    // wake target: prefer provided API (e.g., Render) so we can warm it
    const wakeUrl = targetUrl || DEFAULT_ML_PREDICTION_URL;
    // redirect target remains the Vercel-deployed UI
    const redirectUrl = DEFAULT_ML_PREDICTION_URL;

    // countdown every second
    const interval = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    // immediate wake ping (image beacon + fetch no-cors) to the wake target
    try {
      const img = new Image();
      img.src = wakeUrl + "?wake=1&ts=" + Date.now();
    } catch (e) {
      // ignore
    }
    try {
      fetch(wakeUrl + "?wake=1", { mode: "no-cors" }).catch(() => {});
    } catch (e) {}

    // poll every 5s to keep waking the deployment while counting down
    const poll = setInterval(() => {
      try {
        const img = new Image();
        img.src = wakeUrl + "?wake=1&ts=" + Date.now();
      } catch (e) {}
      try {
        fetch(wakeUrl + "?wake=1", { mode: "no-cors" }).catch(() => {});
      } catch (e) {}
    }, 5000);

    const timeout = setTimeout(() => {
      // Always redirect to the Vercel-hosted prediction UI
      window.location.href = redirectUrl;
    }, 45000);

    return () => {
      clearInterval(interval);
      clearInterval(poll);
      clearTimeout(timeout);
    };
  }, [visible, targetUrl]);

  if (!visible) return null;

  const mlUrl = targetUrl || DEFAULT_ML_PREDICTION_URL;
  // derive a friendly host label for the wake target when available
  let wakeHostLabel: string | null = null;
  try {
    const wakeUrl = targetUrl || DEFAULT_ML_PREDICTION_URL;
    const parsed = new URL(wakeUrl);
    wakeHostLabel = parsed.hostname;
  } catch (e) {
    wakeHostLabel = null;
  }
  return (
    <div className="ml-wait-overlay">
      <div className="ml-wait-card">
        <h3>Preparing ML Prediction</h3>
        <p>
          The prediction API is starting up. Please wait {secondsLeft} second
          {secondsLeft !== 1 ? "s" : ""} — you'll be redirected when ready.
        </p>
        {wakeHostLabel ? (
          <p className="muted">Waking API: {wakeHostLabel}</p>
        ) : null}
        <p className="muted">If nothing happens after 45s, click here:</p>
        <a
          href={DEFAULT_ML_PREDICTION_URL}
          className="nav-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open ML Prediction now
        </a>
      </div>
    </div>
  );
}
