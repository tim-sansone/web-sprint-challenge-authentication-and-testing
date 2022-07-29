const Users = require('../users/users-model');

function checkUserNotTaken(req, res, next) {
    const { username } = req.body;
    Users.getBy({ username })
        .then(user => {
            if(user == null){
                next()
                return
            }
            next({ status: 404, message: 'username taken' })
        })
        .catch(next)
}

module.exports = checkUserNotTaken;
