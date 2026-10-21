import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../api/client.js";

/**
 * Runs an API call and tracks loading / error / data.
 * useFetch(() => shopApi.products(), [deps]) re-runs when deps change; call reload() to run it again.
 */
export default function useFetch(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: "" });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: "" }));
    fetcher()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: "" });
      })
      .catch((err) => {
        if (!cancelled) setState({ data: null, loading: false, error: getErrorMessage(err) });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, reload };
}
