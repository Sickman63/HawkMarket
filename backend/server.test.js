const { Sequelize } = require('sequelize');
const sequelize = require('./server').sequelize;

// backend/server.test.js

jest.mock('sequelize');

describe('Sequelize Connection', () => {
  beforeEach(() => {
    Sequelize.mockClear();
  });

  test('should create a Sequelize instance with correct parameters', () => {
    expect(Sequelize).toHaveBeenCalledWith('hawkmark', 'admin', 'admin', {
      host: '73.176.120.218',
      dialect: 'postgres',
    });
  });

  test('should connect to the database successfully', async () => {
    const syncMock = jest.fn().mockResolvedValue('Connected to PostgreSQL database!');
    Sequelize.prototype.sync = syncMock;

    await sequelize.sync();
    expect(syncMock).toHaveBeenCalled();
    expect(syncMock).toHaveReturnedWith(Promise.resolve('Connected to PostgreSQL database!'));
  });

  test('should fail to connect to the database', async () => {
    const syncMock = jest.fn().mockRejectedValue(new Error('Unable to connect to the database'));
    Sequelize.prototype.sync = syncMock;

    try {
      await sequelize.sync();
    } catch (error) {
      expect(syncMock).toHaveBeenCalled();
      expect(error.message).toBe('Unable to connect to the database');
    }
  });
});