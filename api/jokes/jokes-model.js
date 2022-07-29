const db = require('../../data/dbConfig');

function getAll() {
    return db('jokes').select('joke');
}

function getById(id) {
    return null
}

function create(user) {
    return null
}

function update(id, changes) {
    return null
}

function remove(id) {
    return null
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
}
