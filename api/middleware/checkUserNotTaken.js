const Users = require('../users/users-model');

function checkUserNotTaken(req, res, next) {
    const { username } = req.body;
    Users.getBy({ username }).first()
        .then(user => {
            if(user == null){
                next()
                return
            }
            next({ status: 400, message: 'username taken' })
        })
        .catch(next)
}

module.exports = checkUserNotTaken;
