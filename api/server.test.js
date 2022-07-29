const db = require('../data/dbConfig');
const Users = require('./users/users-model');
const Jokes = require('./jokes/jokes-model');


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

describe('jokes model', () => {
  test('getAll', async () => {
    let result = await Jokes.getAll();
    expect(result).toHaveLength(3);
    expect(result[0]).toMatchObject({ joke: "I'm tired of following my dreams. I'm just going to ask them where they are going and meet up with them later."});
  })
})
