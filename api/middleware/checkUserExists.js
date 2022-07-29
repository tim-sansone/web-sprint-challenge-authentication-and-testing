const Users = require('../users/users-model');

function checkUserExists(req, res, next) {
    const { username } = req.body;
    Users.getBy({ username })
        .then(user => {
            if(user == null){
                next({ status: 404, message: 'user does not exist' })
                return
            }
            req.user = user
            next()
        })
        .catch(next)
}

module.exports = checkUserExists;
