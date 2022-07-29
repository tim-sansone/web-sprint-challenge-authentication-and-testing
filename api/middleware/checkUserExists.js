const Users = require('../users/users-model');

function checkUserExists(req, res, next) {
    const { username } = req.body;
    Users.getBy({ username }).first()
        .then(user => {
            if(user == null){
                next({ status: 400, message: 'invalid credentials' })
                return
            }
            req.user = user
            next()
        })
        .catch(next)
}

module.exports = checkUserExists;
