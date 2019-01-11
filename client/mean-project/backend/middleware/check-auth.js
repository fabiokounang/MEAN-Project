const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = {
      email: decodedToken.email,
      id: decodedToken.id
    };
    console.log(req.userData);
    next();
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed authenticate !'
    })
  }
}