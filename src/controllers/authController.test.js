const { test, expect } = require('@jest/globals');
const jwt = require('jsonwebtoken');
const { Login, Logout, validateToken } = require('./authController');

test('Login with valid admin credentials', async () => {
    const req = {
        body: { username: 'admin', password: 'password' }
    };
    const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
    };
    await Login(req, res);
    expect(res.json).toHaveBeenCalled();
    const token = res.json.mock.calls[0][0].token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.role).toBe('admin');
    expect(decoded.username).toBe('admin');
});

test('Login with invalid credentials', async () => {
    const req = {
        body: { username: 'user', password: 'wrongpassword' }
    };
    const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
    };
    await Login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
});

test('Logout', async () => {
    console.log('Starting Logout test');
    //primeiro tem que pegar o token para depois deslogar
    let req = {
        body: { username: 'admin', password: 'password' }
    };
    let res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
    };
    const result = await Login(req, res);

    console.log('Login result: ', result);

    const token = res.json.mock.calls[0][0].token;

    req = {
        headers: { authorization: `Bearer ${token}` },
        user: { username: 'admin', role: 'admin' }
    };
    res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        locals: { user: { username: 'admin', role: 'admin' } }
    };

    Logout(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'User admin logged out successfully' });
});

test('Validate valid token', () => {
    const token = jwt.sign({
        username: 'admin',
        role: 'admin',
        password: 'password'
    },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    const req = {
        headers: { authorization: `Bearer ${token}` }
    };
    const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
    };
    validateToken(req, res);
    console.log('res.locals after validateToken:', res.locals);
    console.log('res.json calls:', res.json);
    // expect(res.locals.decoded).toBeDefined();
    expect(res.locals.user.username).toBe('admin');
    expect(res.locals.user.role).toBe('admin');
    // expect(res.json).toHaveBeenCalledWith({
    //     valid: true,
    //     user: expect.objectContaining({ username: 'admin', role: 'admin' })
    // });
});

