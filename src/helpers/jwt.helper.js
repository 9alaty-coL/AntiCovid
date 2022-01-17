const jwt = require('jsonwebtoken');

let generateToken = (data, secretSignature) => {
  return new Promise((resolve, reject) => {
 
    // Thực hiện ký và tạo token
    jwt.sign(
      {data: data},
      secretSignature,
      {
        algorithm: "HS256",
      },
      (error, token) => {
        if (error) {
          return reject(error);
        }
        resolve(token);
    });
  });
}

let verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded);
    });
  });
}
module.exports = {
  generateToken: generateToken,
  verifyToken: verifyToken,
};