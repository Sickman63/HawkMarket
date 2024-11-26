const pool = require('./connection');

async function setupDatabase() {
  try {
    console.log('Setting up the database...');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL, -- Changed to singular
        created_on TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
        last_login TIMESTAMP WITHOUT TIME ZONE,
        balance NUMERIC(15, 2) DEFAULT 0.00
        buying_power NUMERIC(15, 2) DEFAULT 0.00
        daily_change NUMERIC(15, 2) DEFAULT 0.00
      );
    `);
    console.log('Users table created successfully');

    // Create portfolio table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS portfolio (
        portfolio_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id),
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
        updated_on TIMESTAMP WITHOUT TIME ZONE
      );
    `);
    console.log('Portfolio table created successfully');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS stock_holdings (
        holding_id SERIAL PRIMARY KEY,
        portfolio_id INTEGER REFERENCES portfolio(portfolio_id),
        symbol VARCHAR(10) NOT NULL,
        market VARCHAR(10) NOT NULL,
        quantity INTEGER NOT NULL,
        purachase_price NUMERIC(10, 2) NOT NULL,
        UNIQUE (portfolio_id, symbol)
      );
    `);
    console.log('Holdings table created successfully');

    // Create transactions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        transaction_id SERIAL PRIMARY KEY,
        portfolio_id INTEGER REFERENCES portfolio(portfolio_id),
        stock_symbol VARCHAR(25) NOT NULL,
        stock_market VARCHAR(255) NOT NULL,
        transaction_type VARCHAR(10) NOT NULL,
        quantity INTEGER NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        transaction_date TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('Transactions table created successfully');

    // Create leaderboard table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leaderboard (
        leaderboard_id SERIAL PRIMARY KEY,
        ranks INTEGER,
        earnings INTEGER,
        user_id INTEGER REFERENCES users(user_id)
      );
    `);
    console.log('Leaderboard table created successfully');

    // Create portfolio value history table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS portfoliovaluehistory (
        history_id SERIAL PRIMARY KEY,
        portfolio_id INTEGER REFERENCES portfolio(portfolio_id),
        value NUMERIC(15, 2),
        transactions_id INTEGER REFERENCES transactions(transaction_id),
        recorded_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('PortfolioValueHistory table created successfully');

    // Create stock table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS stock (
          symbol VARCHAR(10) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          market VARCHAR(255) NOT NULL,
          current_price NUMERIC(15, 2) NOT NULL,
          last_updated TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
        );
      `);
      console.log('Stock table created successfully');

  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await pool.end(); // End the connection pool to release all clients
  }
}

// Run the setup script
setupDatabase();
