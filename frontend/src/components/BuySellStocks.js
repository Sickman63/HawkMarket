import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from '../api/axiosConfig';
import { debounce } from 'lodash';
import { Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  background-color: #121212;
  color: #f0f0f0;
  min-height: 100vh;
`;

// Header Styling
const Header = styled.header`
  width: 100%;
  max-width: 1200px;
  background-color: #1f1f1f;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  margin-bottom: 30px;

  h1 {
    font-size: 2.2rem;
    color: #00bcd4;
  }

  div {
    p {
      font-size: 1.2rem;
      margin: 0;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
`;

// Section Styling
const Section = styled.section`
  width: 100%;
  max-width: 1200px;
  background-color: #1f1f1f;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  margin-bottom: 30px;

  h2 {
    color: #00bcd4;
    font-size: 1.8rem;
    margin-bottom: 20px;
  }
`;

// Input Styling
const Input = styled.input`
  padding: 15px;
  font-size: 1rem;
  border: 1px solid #444;
  border-radius: 8px;
  margin-bottom: 15px;
  width: 90%;
  max-width: 500px;
  background-color: #2a2a2a;
  color: #f0f0f0;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// Select Styling
const Select = styled.select`
  padding: 15px;
  font-size: 1rem;
  border: 1px solid #444;
  border-radius: 8px;
  background-color: #2a2a2a;
  color: #f0f0f0;
  width: 90%;
  max-width: 500px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// Button Styling
const Button = styled.button`
  padding: 15px;
  font-size: 1.1rem;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  margin-top: 15px;
  width: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
`;

const PreviewButton = styled(Button)`
  background-color: #4a90e2;

  &:hover {
    background-color: #357ab8;
  }
`;

const ClearButton = styled(Button)`
  background-color: #d9534f;

  &:hover {
    background-color: #c9302c;
  }
`;

// Suggestions List Styling
const SuggestionsList = styled.ul`
  list-style-type: none;
  padding: 0;
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
  background-color: #2e3241;
  border-radius: 8px;
  border: 1px solid #444;
  margin-bottom: 15px;
`;

const SuggestionItem = styled.li`
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #4a90e2;
  }
`;

const BuySellStocks = () => {
  const [userInfo, setUserInfo] = useState({ balance: null, buying_power: null });
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [quantity, setQuantity] = useState('');
  const [symbol, setSymbol] = useState('');
  const [action, setAction] = useState('Buy');
  const [selectedStock, setSelectedStock] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewDetails, setPreviewDetails] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      try {
        const userRes = await axios.get('/users/user-info', { headers: { Authorization: `Bearer ${token}` } });
        setUserInfo(userRes.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, []);

  const debouncedHandleSymbolChange = debounce((input) => {
    setSymbol(input);
    setLoading(true);
  }, 500);

  const handleSymbolChange = (e) => {
    const input = e.target.value.toUpperCase();
    setError('');
    setSelectedStock(null);
    setFilteredStocks([]);
    setLoading(true);
    debouncedHandleSymbolChange(input);
  };

  useEffect(() => {
    const fetchStockData = async () => {
      if (!symbol) {
        setLoading(false);
        return;
      }

      try {
        const stocksRes = await axios.get('/stocks', { params: { symbol } });
        if (stocksRes.data && stocksRes.data.length === 0) {
          setError('Invalid stock symbol. Please try again.');
          setStocks([]);
        } else {
          setStocks(Array.isArray(stocksRes.data) ? stocksRes.data : [stocksRes.data]);
          setError('');
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setError('Invalid stock symbol. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchStockData();
  }, [symbol]);

  useEffect(() => {
    if (symbol && Array.isArray(stocks)) {
      const matches = stocks.filter(stock => stock.symbol.toUpperCase().includes(symbol));
      setFilteredStocks(matches);
    } else {
      setFilteredStocks([]);
    }
  }, [stocks, symbol]);

  const handleStockSelect = (stock) => {
    setSymbol(stock.symbol);
    setSelectedStock(stock);
    setFilteredStocks([]);
  };

  const handlePreview = (e) => {
    e.preventDefault();
    if (!symbol || !quantity) {
      setError('Please enter a valid stock symbol and quantity.');
      return;
    }

    const selected = stocks.find(stock => stock.symbol === symbol);
    if (!selected) {
      setError(`${symbol} is not a valid symbol.`);
      return;
    }

    setPreviewDetails({
      symbol: selected.symbol,
      name: selected.name,
      price: selected.current_price,
      quantity,
      total: (selected.current_price * quantity).toFixed(2)
    });

    setIsPreviewing(true);
  };

  const handleConfirmPreview = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/trades/${action.toLowerCase()}`, {
        symbol,
        market: selectedStock.market,
        quantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsConfirmed({
        action,
        symbol,
        quantity,
        name: selectedStock.name,
      });

      setQuantity('');
      setSymbol('');
      setSelectedStock(null);
      setIsPreviewing(false);
    } catch (error) {
      console.error('Error executing trade:', error);
      setError('Failed to complete the trade. Please try again.');
    }
  };

  const handleClear = () => {
    setQuantity('');
    setSymbol('');
    setSelectedStock(null);
    setError('');
    setIsPreviewing(false);
    setIsConfirmed(null);
  };

  const handleChangeOrder = () => {
    setIsPreviewing(false);
  };

  return (
    <Container>
      <Header>
        <h1>Trade Stocks</h1>
        <div>
          <p>Account Value: ${userInfo.balance !== null ? userInfo.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'Loading...'}</p>
          <p>Buying Power: ${userInfo.buying_power !== null ? userInfo.buying_power.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'Loading...'}</p>
        </div>
      </Header>

      {!isConfirmed && (
        <>
          {!isPreviewing && (
            <Section>
              <h2>Search for a Stock</h2>
              <Input
                type="text"
                placeholder="Stock Symbol"
                value={symbol}
                onChange={handleSymbolChange}
                required
              />
              {loading && <p>Loading...</p>}
              {filteredStocks.length > 0 && (
                <SuggestionsList>
                  {filteredStocks.map(stock => (
                    <SuggestionItem key={stock.symbol} onClick={() => handleStockSelect(stock)}>
                      {stock.symbol} - {stock.name}
                    </SuggestionItem>
                  ))}
                </SuggestionsList>
              )}
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </Section>
          )}

          {selectedStock && !isPreviewing && (
            <Section>
              <h3>{selectedStock.name} ({selectedStock.symbol})</h3>
              <p>Current Price: ${selectedStock.current_price}</p>
              <p>Day's High: ${selectedStock.high || 'N/A'}</p>
              <p>Day's Low: ${selectedStock.low || 'N/A'}</p>
              <p>Volume: {selectedStock.volume || 'N/A'}</p>
            </Section>
          )}

          {!isPreviewing && (
            <Section>
              <h2>Trade Form</h2>
              <form onSubmit={handlePreview}>
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
                <Select value={action} onChange={(e) => setAction(e.target.value)}>
                  <option value="Buy">Buy</option>
                  <option value="Sell">Sell</option>
                </Select>
                <PreviewButton type="submit">Preview Order</PreviewButton>
                <ClearButton type="button" onClick={handleClear}>Clear</ClearButton>
              </form>
            </Section>
          )}

          {isPreviewing && previewDetails && (
            <Section>
              <h3>Preview Order</h3>
              <p>Stock: {previewDetails.name} ({previewDetails.symbol})</p>
              <p>Price: ${previewDetails.price}</p>
              <p>Quantity: {previewDetails.quantity}</p>
              <p>Total: ${previewDetails.total}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                <Button type="button" onClick={handleChangeOrder} style={{ backgroundColor: '#f0ad4e' }}>Change Order</Button>
                <Button type="button" onClick={handleConfirmPreview} style={{ backgroundColor: '#4a90e2' }}>Confirm Trade</Button>
              </div>
            </Section>
          )}
        </>
      )}

      {isConfirmed && (
        <Section>
          <h3>Trade Confirmation</h3>
          <p>{isConfirmed.action} Market order for {isConfirmed.symbol} ({isConfirmed.name}) received.</p>
          <p>Your order has been received and will be executed shortly.</p>
          <ul>
            <li>
              To submit another stock order, 
              <button 
                onClick={handleClear}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#61dafb', 
                  textDecoration: 'underline', 
                  cursor: 'pointer',
                  padding: '0',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  display: 'inline',
                }}
              >
                click here
              </button>.
            </li>
            <li>To return to your portfolio summary, <Link to="/dashboard">click here</Link>.</li>
          </ul>
        </Section>
      )}
    </Container>
  );
};

export default BuySellStocks;
