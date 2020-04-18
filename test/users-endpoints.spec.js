const app = require('../src/app')

describe('users', () => {
  it('GET /users responds with 200 containing "Hello, users!"', () => {
    return supertest(app)
      .get('/users')
      .expect(200, 'Hello, users!')
  })
})