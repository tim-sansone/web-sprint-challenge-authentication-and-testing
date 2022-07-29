const request = require('supertest');

const db = require('../data/dbConfig');
const server = require('./server')

const Users = require('./users/users-model');


test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
})

beforeEach(async () => {
  await db.seed.run();
})

afterAll(async () => {
  await db.destroy();
})

describe('users model', () => {
  test('getAll', async () => {
    let result = await Users.getAll();
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ username: 'tim' });
  });

  test('getById', async () => {
    let result = await Users.getById(2);
    expect(result).toBeDefined();
    expect(result).toMatchObject({ id: 2, username: 'pam' });

    result = await Users.getById(3);
    expect(result).not.toBeDefined();
  })

  test('getBy', async () => {
    let result = await Users.getBy({ username: 'tim' });
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ id: 1, username: 'tim' })

    result = await Users.getBy({ username: 'bob' });
    expect(result).toHaveLength(0);
    expect(result[0]).not.toBeDefined();
  })

  test('create', async () => {
    let result = await Users.create({ username: 'bob', password: '1234' });
    expect(result).toEqual({ id: 3, username: 'bob', password: '1234' });

    result = await Users.getAll();
    expect(result).toHaveLength(3)
  });

  test('update', async () => {
    let result = await Users.update(1, { username: 'timothy' });
    expect(result).toMatchObject({ id: 1, username: 'timothy' });

    result = await Users.getAll();
    expect(result).toHaveLength(2)
  });

  test('delete', async () => {
    let result = await Users.remove(2)
    expect(result).toBe(1)

    result = await Users.getAll();
    expect(result).toHaveLength(1);

    result = await Users.getById(1);
    expect(result).toBeDefined();
    expect(result).toMatchObject({ id: 1, username: 'tim' });
  });
})

describe('registration endpoint', () => {
  test('returns correct information on successful registration', async () => {
    let result = await request(server).post('/api/auth/register').send({ username: 'bob', password: '1234' });
    expect(result.body).toMatchObject({ id: 3, username: 'bob' });
    expect(result.body).toHaveProperty('password');
    expect(result.status).toBe(201)
  })

  test('returns correct error message on missing username or password', async () => {
    let result = await request(server).post('/api/auth/register').send({ username: 'bob' })
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('username and password required');

    result = await request(server).post('/api/auth/register').send({ password: '1234' })
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('username and password required');
  })

  test('returns correct error message on username taken', async () => {
    let result = await request(server).post('/api/auth/register').send({ username: 'tim', password: '1234' });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('username taken');
  })
})

describe('login endpoint', () => {
  test('returns correct information on successful login', async () => {
    let result = await request(server).post('/api/auth/login').send({ username: 'tim', password: '1234' });
    expect(result.status).toBe(200);
    expect(result.body).toMatchObject({ message: 'welcome, tim' });
    expect(result.body).toHaveProperty('token');
  })

  test('returns correct error message on missing username or password', async () => {
    let result = await request(server).post('/api/auth/login').send({ username: 'bob' })
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('username and password required');

    result = await request(server).post('/api/auth/login').send({ password: '1234' })
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('username and password required');
  })

  test('returns correct error message on username not exist or bad password', async () => {
    let result = await request(server).post('/api/auth/login').send({ username: 'bob', password: '1234' })
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('invalid credentials');

    result = await request(server).post('/api/auth/login').send({ username: 'tim', password: '2345' })
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('invalid credentials');
  });
});

describe('jokes endpoint', () => {
  test('on valid token, returns jokes', async () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoxLCJ1c2VybmFtZSI6InRpbSIsImlhdCI6MTY1OTEyMTQ1NiwiZXhwIjoxNjU5MTUwMjU2fQ.EbbxDtBI3zSOldj86CrjCqdUINe1TTN-T_Z4jcdz92E"
    let result = await request(server).get('/api/jokes').set('authorization', token);
    expect(result.body).toHaveLength(3);
    expect(result.body[0]).toEqual({
      "id": "0189hNRf2g",
      "joke": "I'm tired of following my dreams. I'm just going to ask them where they are going and meet up with them later."
    });
  });

  test('correct error message on missing token', async () => {
    let result = await request(server).get('/api/jokes');
    expect(result.status).toBe(401);
    expect(result.body.message).toBe('token required');
  });

  test('correct error message on invalid token', async () => {
    let result = await request(server).get('/api/jokes').set('authorization', 'please let me in!');
    expect(result.status).toBe(401);
    expect(result.body.message).toBe('token invalid');
  })
});
