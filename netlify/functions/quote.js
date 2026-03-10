exports.handler = async function(event) {
  const ticker = event.queryStringParameters?.ticker;
  if (!ticker) return { statusCode: 400, body: "missing ticker" };
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${ticker}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
        "Referer": "https://finance.yahoo.com"
      }
    });
    const data = await res.json();
    const result = data?.quoteResponse?.result?.[0];
    if (!result) return { statusCode: 404, body: JSON.stringify({ error: "no data" }) };
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      body: JSON.stringify({ changePct: result.regularMarketChangePercent || 0 })
    };
  } catch(e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
