const { Sequelize } = require('sequelize');

describe('Sequelize Connection', () => {
  let sequelize;

  beforeAll(() => {
    sequelize = new Sequelize('hawkmark', 'admin', 'admin', {
      host: '73.176.120.218',
      dialect: 'postgres',
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('should connect to the database', async () => {
    await expect(sequelize.authenticate()).resolves.not.toThrow();
  });
});