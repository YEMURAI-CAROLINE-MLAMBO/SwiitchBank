import React, { useState, useEffect } from 'react';

const BridgeInterface = ({ type = 'fiat_to_crypto' }) => {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [bridgeQuote, setBridgeQuote] = useState(null);
  const [fromAsset, setFromAsset] = useState('USD');
  const [toAsset, setToAsset] = useState('BTC');
  const [bridgeAdvice, setBridgeAdvice] = useState('Sophia is thinking...');
  const [isSwapped, setIsSwapped] = useState(false);

  // --- MOCK API CALLS ---
  const calculateBridge = async (amount, from, to) => {
    if (!amount || parseFloat(amount) <= 0) {
        setBridgeQuote(null);
        setToAmount('');
        return;
    }
    // In a real app, this would be a POST request.
    const response = await fetch(`/api/bridge/quote?amount=${amount}&fromAsset=${from}&toAsset=${to}`);
    const quote = await response.json();

    setBridgeQuote(quote);
    setToAmount(quote.toAmount.toFixed(6));
  };

  const fetchSophiaAdvice = async () => {
      // In a real app, this would be a POST to a Sophia-specific endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBridgeAdvice('Based on market trends, now might be a good time to diversify your portfolio.');
  };

  const executeBridge = () => {
      if (!bridgeQuote) return;
      alert(`Bridge initiated!\n\nDetails:\n- From: ${fromAmount} ${fromAsset}\n- To: ${toAmount} ${toAsset}\n- Fee: $${bridgeQuote.fee.toFixed(2)}`);
  };

  // --- EFFECTS ---
  useEffect(() => {
      fetchSophiaAdvice();
  }, [type]);

   useEffect(() => {
    // Determine initial assets based on type, handling swap
    if (type === 'fiat_to_crypto') {
      setFromAsset(isSwapped ? 'BTC' : 'USD');
      setToAsset(isSwapped ? 'USD' : 'BTC');
    } else if (type === 'crypto_to_fiat') {
      setFromAsset(isSwapped ? 'USD' : 'BTC');
      setToAsset(isSwapped ? 'BTC' : 'USD');
    } else { // crypto_swap
       setFromAsset(isSwapped ? 'ETH' : 'BTC');
       setToAsset(isSwapped ? 'BTC' : 'ETH');
    }
  }, [type, isSwapped]);


  // --- HANDLERS ---
  const handleAmountChange = (e) => {
      setFromAmount(e.target.value);
      calculateBridge(e.target.value, fromAsset, toAsset);
  };

  const reverseDirection = () => {
    setIsSwapped(!isSwapped);
    const tempFromAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempFromAmount);
  };

  return (
    <div className="bridge-interface">
      <div className="bridge-header">
        <h2>
          {type === 'fiat_to_crypto' && '💰 → 🪙 Buy Crypto'}
          {type === 'crypto_to_fiat' && '🪙 → 💰 Cash Out'}
          {type === 'crypto_swap' && '🔄 Swap Crypto'}
        </h2>
      </div>

      <div className="bridge-form">
        {/* From Asset */}
        <div className="asset-input">
          <label>From</label>
          <div className="input-group">
            <input
              type="number"
              value={fromAmount}
              onChange={handleAmountChange}
              placeholder="0.00"
            />
            <select value={fromAsset} onChange={(e) => setFromAsset(e.target.value)}>
              {type === 'fiat_to_crypto' && <option value="USD">USD</option>}
              {type !== 'fiat_to_crypto' && (
                <>
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                  <option value="USDC">USDC</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Swap Arrow */}
        <div className="swap-arrow" onClick={reverseDirection}>
          ⇅
        </div>

        {/* To Asset */}
        <div className="asset-input">
          <label>To</label>
          <div className="input-group">
            <input
              type="number"
              value={toAmount}
              readOnly
              placeholder="0.00"
              className="readonly"
            />
            <select value={toAsset} onChange={(e) => setToAsset(e.target.value)}>
              {type === 'crypto_to_fiat' && <option value="USD">USD</option>}
               {type !== 'crypto_to_fiat' && (
                <>
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                  <option value="USDC">USDC</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Bridge Quote */}
        {bridgeQuote && (
          <div className="bridge-quote">
            <div className="quote-details">
              <div>Rate: 1 {fromAsset} = {bridgeQuote.exchangeRate.toFixed(6)} {toAsset}</div>
              <div>Fee: ${bridgeQuote.fee.toFixed(2)}</div>
              <div>Arrival: {bridgeQuote.estimatedArrival}</div>
            </div>
            <button className="primary-button" onClick={executeBridge}>
              Confirm Bridge
            </button>
          </div>
        )}
      </div>

      {/* Sophia Advice */}
      <div className="sophia-bridge-advice">
        <h4>🧠 Sophia's Advice</h4>
        <p>{bridgeAdvice}</p>
      </div>
    </div>
  );
};

export default BridgeInterface;
