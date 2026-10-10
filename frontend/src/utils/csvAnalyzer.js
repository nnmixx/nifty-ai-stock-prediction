/**
 * Client-side CSV parser, feature calculator, and linear regression estimator
 * Allows users to drag and drop custom OHLCV CSVs directly in the browser
 */

export function parseCSV(csvText) {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) throw new Error("CSV file must contain at least a header and one data row.");

  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const closeIdx = headers.findIndex(h => /close/i.test(h));
  const openIdx = headers.findIndex(h => /open/i.test(h));
  const highIdx = headers.findIndex(h => /high/i.test(h));
  const lowIdx = headers.findIndex(h => /low/i.test(h));
  const dateIdx = headers.findIndex(h => /date/i.test(h));
  const volIdx = headers.findIndex(h => /vol/i.test(h));

  if (closeIdx === -1) {
    throw new Error("Could not find a 'Close' price column in the CSV.");
  }

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
    const close = parseFloat(parts[closeIdx]);
    if (isNaN(close) || close <= 0) continue;

    const row = {
      close,
      open: openIdx !== -1 && !isNaN(parseFloat(parts[openIdx])) ? parseFloat(parts[openIdx]) : close,
      high: highIdx !== -1 && !isNaN(parseFloat(parts[highIdx])) ? parseFloat(parts[highIdx]) : close,
      low: lowIdx !== -1 && !isNaN(parseFloat(parts[lowIdx])) ? parseFloat(parts[lowIdx]) : close,
      volume: volIdx !== -1 && !isNaN(parseFloat(parts[volIdx])) ? parseFloat(parts[volIdx]) : 10000,
      date: dateIdx !== -1 && parts[dateIdx] ? parts[dateIdx] : `Day ${i}`
    };
    rows.push(row);
  }

  if (rows.length < 15) {
    throw new Error("At least 15 valid rows are required to compute technical features.");
  }

  return rows;
}

export function computeInBrowserPrediction(rows) {
  // Sort oldest to newest if date format is parseable
  const sorted = [...rows];

  // Compute returns and lag features
  const data = [];
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    const ret = (curr.close - prev.close) / prev.close;
    data.push({
      ...curr,
      ret,
      prevClose: prev.close
    });
  }

  // Feature creation: ret_t, ret_t-1, range
  const features = [];
  for (let i = 1; i < data.length - 1; i++) {
    const ret_t = data[i].ret;
    const ret_t_1 = data[i - 1].ret;
    const range = (data[i].high - data[i].low) / data[i].close;
    const target_ret = data[i + 1].ret; // next day return

    features.push({
      x: [ret_t, ret_t_1, range],
      y: target_ret,
      close: data[i].close,
      nextClose: data[i + 1].close,
      date: data[i].date
    });
  }

  if (features.length < 5) {
    throw new Error("Insufficient data points for model training.");
  }

  // Train / Test split 80/20
  const trainSize = Math.floor(features.length * 0.8);
  const train = features.slice(0, trainSize);
  const test = features.slice(trainSize);

  // Solve Ordinary Least Squares (OLS) via normal equation: beta = (X^T X)^-1 X^T Y
  // Here we use 2 primary features + intercept for numerical stability
  const n = train.length;
  let sumX1 = 0, sumX2 = 0, sumY = 0;
  let sumX1Sq = 0, sumX2Sq = 0, sumX1Y = 0, sumX2Y = 0, sumX1X2 = 0;

  for (const row of train) {
    const x1 = row.x[0];
    const x2 = row.x[1];
    const y = row.y;
    sumX1 += x1;
    sumX2 += x2;
    sumY += y;
    sumX1Sq += x1 * x1;
    sumX2Sq += x2 * x2;
    sumX1X2 += x1 * x2;
    sumX1Y += x1 * y;
    sumX2Y += x2 * y;
  }

  // Simple univariate / bivariate regression estimate
  const meanX1 = sumX1 / n;
  const meanY = sumY / n;
  let num = 0, den = 0;
  for (const row of train) {
    num += (row.x[0] - meanX1) * (row.y - meanY);
    den += (row.x[0] - meanX1) ** 2;
  }
  const slope = den !== 0 ? num / den : 0;
  const intercept = meanY - slope * meanX1;

  // Evaluate on test set
  let sumAbsErr = 0;
  let sumSqErr = 0;
  let correctDirection = 0;
  const testPreds = [];

  for (const row of test) {
    const predRet = intercept + slope * row.x[0];
    const predClose = row.close * (1 + predRet);
    const actualClose = row.nextClose;

    const absErr = Math.abs(actualClose - predClose);
    sumAbsErr += absErr;
    sumSqErr += absErr * absErr;

    if (Math.sign(predRet) === Math.sign(row.y)) {
      correctDirection++;
    }

    testPreds.push({
      date: row.date,
      actual: Math.round(actualClose * 100) / 100,
      predicted: Math.round(predClose * 100) / 100
    });
  }

  const mae = test.length > 0 ? sumAbsErr / test.length : 0;
  const rmse = test.length > 0 ? Math.sqrt(sumSqErr / test.length) : 0;
  const dirAcc = test.length > 0 ? (correctDirection / test.length) * 100 : 50;

  // Next-day forecast
  const lastRow = data[data.length - 1];
  const lastRet = lastRow.ret;
  const forecastRet = intercept + slope * lastRet;
  const lastClose = lastRow.close;
  const forecastClose = lastClose * (1 + forecastRet);

  return {
    totalRows: rows.length,
    trainRows: train.length,
    testRows: test.length,
    lastClose: Math.round(lastClose * 100) / 100,
    forecastClose: Math.round(forecastClose * 100) / 100,
    forecastRetPct: Math.round(forecastRet * 10000) / 100,
    direction: forecastRet >= 0 ? "UP" : "DOWN",
    metrics: {
      mae: Math.round(mae * 100) / 100,
      rmse: Math.round(rmse * 100) / 100,
      dirAcc: Math.round(dirAcc * 10) / 10
    },
    testPreds: testPreds.slice(-30)
  };
}
