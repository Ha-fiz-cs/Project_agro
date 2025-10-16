const jwt = require('jsonwebtoken');

exports.sign = (payload) => jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
exports.verify = (token) => jwt.verify(token, process.env.JWT_SECRET || 'secret');
