const app = require('../src/app')

describe('notes', () => {
  it('GET /notes responds with 200 containing "Hello, notes!"', () => {
    return supertest(app)
      .get('/notes')
      .expect(200, 'Hello, notes!')
  })
})