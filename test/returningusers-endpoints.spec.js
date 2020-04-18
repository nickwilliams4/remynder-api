const app = require('../src/app')

describe('ReturningUser', () => {
  it('GET /ReturningUser responds with 200 containing "Hello, ReturningUser!"', () => {
    return supertest(app)
      .get('/ReturningUser')
      .expect(200, 'Hello, ReturningUser!')
  })
})