const db = require('../../data/dbConfig');

function getAll() {
    return db('users')
}

function getBy(filter) {
    return db('users').where(filter);
}

function getById(id) {
    return db('users').where({ id }).first()
}

async function create(user) {
    const [id] = await db('users').insert(user);
    return getById(id);
}

async function update(id, changes) {
    await db('users').update(changes).where({ id })
    return getById(id)
}

function remove(id) {
    return db('users').delete().where({ id })
}

module.exports = {
    getAll,
    getBy,
    getById,
    create,
    update,
    remove
}
