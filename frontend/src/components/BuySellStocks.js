import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from '../api/axiosConfig';
import { debounce } from 'lodash';
import { Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #1c1e26;
  color: #f5f5f5;
`;

const Header = styled.header`
  width: 100%;
  padding: 20px;
  background-color: #2c3e50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

const FormContainer = styled.div`
  width: 100%;
  margin-top: 1.5rem;
`;

const StockInfoContainer = styled.div`
  width: 100%;
  margin-top: 1.5rem;
  background-color: #3a3f4b;
  padding: 1.5rem;
  border-radius: 8px;
`;

const TradeForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  grid-column: span 2;
  padding: 0.75rem;
  font-size: 1rem;
  color: white;
  background-color: #4a90e2;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

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

const SuggestionsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 0.5rem;
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
  background-color: #2e3241;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const SuggestionItem = styled.li`
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #4a90e2;
  }
`;

const LoadingIndicator = styled.p`
  color: #4a90e2;
`;

const PreviewContainer = styled.div`
  width: 100%;
  margin-top: 1.5rem;
  background-color: #3a3f4b;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: left;
`;

const PreviewButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const ChangeOrderButton = styled(Button)`
  background-color: #f0ad4e;

  &:hover {
    background-color: #ec971f;
  }
`;

const ConfirmTradeButton = styled(Button)`
  background-color: #4a90e2;

  &:hover {
    background-color: #357ab8;
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
  const [isConfirmed, setIsConfirmed] = useState(null); // New state for trade confirmation

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
          setError(''); // Clear any previous errors
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
      await axios.post('/trades/' + (action.toLowerCase()), {
        symbol,
        market: selectedStock.market,
        quantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Set the trade confirmation state
      setIsConfirmed({
        action,
        symbol,
        quantity,
        name: selectedStock.name,
      });

      // Clear form inputs and hide the form/preview
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
            <FormContainer>
              <h2>Search for a Stock</h2>
              <Input
                type="text"
                placeholder="Stock Symbol"
                value={symbol}
                onChange={handleSymbolChange}
                required
              />
              {loading && <LoadingIndicator>Loading...</LoadingIndicator>}
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
            </FormContainer>
          )}

          {selectedStock && !isPreviewing && (
            <StockInfoContainer>
              <h3>{selectedStock.name} ({selectedStock.symbol})</h3>
              <p>Current Price: ${selectedStock.current_price}</p>
              <p>Day's High: ${selectedStock.high || "N/A"}</p>
              <p>Day's Low: ${selectedStock.low || "N/A"}</p>
              <p>Volume: {selectedStock.volume || "N/A"}</p>
            </StockInfoContainer>
          )}

          <FormContainer>
            <h2>Trade Form</h2>
            {!isPreviewing && (
              <TradeForm onSubmit={handlePreview}>
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
                <Button type="submit">Preview Order</Button>
                <ClearButton type="button" onClick={handleClear}>Clear</ClearButton>
              </TradeForm>
            )}
          </FormContainer>

          {isPreviewing && previewDetails && (
            <PreviewContainer>
              <h3>Preview Order</h3>
              <p>Stock: {previewDetails.name} ({previewDetails.symbol})</p>
              <p>Price: ${previewDetails.price}</p>
              <p>Quantity: {previewDetails.quantity}</p>
              <p>Total: ${previewDetails.total}</p>
              <PreviewButtonContainer>
                <ChangeOrderButton type="button" onClick={handleChangeOrder}>Change Order</ChangeOrderButton>
                <ConfirmTradeButton type="button" onClick={handleConfirmPreview}>Confirm Trade</ConfirmTradeButton>
              </PreviewButtonContainer>
            </PreviewContainer>
          )}
        </>
      )}

      {isConfirmed && (
        <StockInfoContainer>
          <h3>Trade Confirmation</h3>
          <p>{isConfirmed.action} Market order for {isConfirmed.symbol} ({isConfirmed.name}) received.</p>
          <p>Your order has been received and will be executed shortly.</p>
          <ul>
            <li>To submit another stock order, 
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
            </button>.</li>
            <li>To return to your portfolio summary, <Link to="/dashboard">click here</Link>.</li>
          </ul>
        </StockInfoContainer>
      )}
    </Container>
  );
};

export default BuySellStocks;
