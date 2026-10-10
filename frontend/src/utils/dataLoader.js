/**
 * Data loader utility with automatic backend fallback
 * Checks if FastAPI backend is online, otherwise falls back to static JSON in /data/
 */

const API_BASE = '/api';
const STATIC_BASE = '/data';

let isBackendAvailable = null;

export async function checkBackendHealth() {
  if (isBackendAvailable !== null) return isBackendAvailable;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${API_BASE}/indices`, { signal: controller.signal });
    clearTimeout(timeout);
    isBackendAvailable = res.ok;
  } catch (e) {
    isBackendAvailable = false;
  }
  return isBackendAvailable;
}

export async function fetchIndices() {
  const online = await checkBackendHealth();
  if (online) {
    try {
      const res = await fetch(`${API_BASE}/indices`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error, falling back to static JSON');
    }
  }
  const res = await fetch(`${STATIC_BASE}/indices.json`);
  return await res.json();
}

export async function fetchHistory(symbol = 'NSEI') {
  const online = await checkBackendHealth();
  if (online) {
    try {
      const res = await fetch(`${API_BASE}/history?index=${symbol}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error, falling back to static JSON');
    }
  }
  const res = await fetch(`${STATIC_BASE}/${symbol.toUpperCase()}_history.json`);
  return await res.json();
}

export async function fetchSummary(symbol = 'NSEI') {
  const online = await checkBackendHealth();
  if (online) {
    try {
      const res = await fetch(`${API_BASE}/metrics?index=${symbol}`);
      if (res.ok) {
        // also get features & backtest
        const [featRes, btRes] = await Promise.all([
          fetch(`${API_BASE}/features?index=${symbol}`),
          fetch(`${API_BASE}/backtest?index=${symbol}`)
        ]);
        const metricsData = await res.json();
        const featData = featRes.ok ? await featRes.json() : {};
        const btData = btRes.ok ? await btRes.json() : {};
        return {
          ...metricsData,
          feature_importances: featData.feature_importances,
          correlation_matrix: featData.correlation_matrix,
          backtest: btData
        };
      }
    } catch (e) {
      console.warn('API error, falling back to static JSON');
    }
  }
  const res = await fetch(`${STATIC_BASE}/${symbol.toUpperCase()}_summary.json`);
  return await res.json();
}
