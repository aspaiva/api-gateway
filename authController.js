const jwt = require('jsonwebtoken');

function Login(req, res) {
  const { username, password } = req.body;
  let token

  if (username === 'admin' && password === 'password') {
    token = jwt.sign(
      { username: username, role: 'admin' },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
        algorithm: 'HS256'
      }
    );
  } else if (username !== 'admin' && password === 'password') {
    token = jwt.sign(
      { username: username, role: 'user' },
      process.env.JWT_SECRET,
      {
        expiresIn: '20m',
        algorithm: 'HS256'
      }
    );
  } else
    return res.status(401).json({ message: 'Invalid credentials' });

  res.json({ token });
}

// Middleware to validate token antes das ações que precisam de autenticação (logout, etc)
function validateToken(req, res, next) {
  try {
    let token = req.headers['authorization'];
    token = token.replace('Bearer ', ''); // Remove 'Bearer ' prefix if present

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.user = decoded; // Store decoded info in res.locals
    console.log(`Authenticated user: ${decoded.username}`);

    next();

  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Failed to authenticate token' });
  }
}

function Logout(req, res) {
  const user = res.locals.user; // Access user info from res.locals
  console.log(`User ${user.username} logged out`);
  // In a real application, you might want to handle token blacklisting or session invalidation here
  res.json({ message: `User ${user.username} logged out successfully` });
}

module.exports = { Login, Logout, validateToken };
