function checkPayload(req, res, next) {
    const { username, password } = req.body;
    if(username == null || typeof username !== 'string' || username.trim() === ''){
        next({ status: 400, message: 'username and password required' })
        return;
    }
    if(password == null || typeof password !== 'string' || password.trim() === ''){
        next({ status: 400, message: 'username and password required' })
        return;
    }
    next()
}

module.exports = checkPayload;
