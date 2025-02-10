import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return res.status(403).json({
      error: 'No token provided'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({
        error: 'Failed to authenticate token'
      });
    }

    req.userId = decoded.id;
    next();
  });
};