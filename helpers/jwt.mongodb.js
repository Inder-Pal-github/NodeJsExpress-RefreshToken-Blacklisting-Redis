const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const { client } = require("./init_redis");
require("dotenv").config();

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      // console.log(userId,"signAccessToken");
      const payload = {};
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: "5m",
        issuer: "inder39811@gmail.com",
        audience: userId,
      };
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message, "signAccessTokenError");
          reject(createError.InternalServerError());
          // reject(err); // don't reject error directly, because it is issue with backend not from user side.
        }
        resolve(token);
      });
    });
  },
  verifyAccessToken: (req, res, next) => {
    if (!req.headers.authorization) return next(createError.Unauthorized());
    const authToken = req.headers.authorization.split(" ")[1];
    jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(createError.Unauthorized(message));
      }
      req.payload = payload;
      next();
    });
  },
  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      // console.log(userId,"signRefreshToken");
      const payload = {};
      const secret = process.env.REFRESH_TOKEN_SECRET;
      const options = {
        expiresIn: "1h",
        issuer: "inder39811@gmail.com",
        audience: userId,
      };
      jwt.sign(payload, secret, options, async (err, token) => {
        if (err) {
          reject(createError.InternalServerError());
          // reject(err); // don't reject error directly, because it is issue with backend not from user side.
        }
        /// storing the userId <--> token  inside redis to access it for other purposes.
        let result = client.SET(userId, token, {"EX":60*60}, (err) => {
          if (err) {
            console.log(err.message, "signRefreshTokenError");
            reject(createError.InternalServerError());
          }
        });
        result.then((res)=>resolve(token));        
      });
    });
  },
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) return reject(createError.Unauthorized());
          const userId = payload.aud;
          async function getToken(key) {
            const redisToken = await client.GET(userId);
            return redisToken;
          }
          getToken(userId)
            .then((res) => {
              console.log("res after verifying token with redis token", res);
              if (res === refreshToken) resolve(userId);
              else {
                reject(createError.Unauthorized());
              }
            })
            .catch((err) => {
              console.log(err);
              reject(createError.InternalServerError());
              return;
            });
        }
      );
    });
  },
};
