const { client } = require("../helpers/init_redis");
const createError = require("http-errors");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/jwt.mongodb");
const { AuthSchema } = require("../helpers/validation_schema");
const { User } = require("../Models/User.model");

module.exports = {
  register: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      // console.log(email, password);
      // if (!email || !password) throw createError.BadRequest();
      const result = await AuthSchema.validateAsync(req.body);
      console.log(result);

      const doesExist = await User.findOne({ email: result.email });
      if (doesExist)
        throw createError.Conflict(
          `${result.email} is already been registered.`
        );

      const user = new User(result);
      const savedUser = await user.save();
      const accessToken = await signAccessToken(savedUser.id);
      const refreshToken = await signRefreshToken(user.id);

      res.send({ user: savedUser, token: accessToken, refreshToken });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      const result = await AuthSchema.validateAsync(req.body);
      const user = await User.findOne({ email: result.email });
      if (!user) throw createError.NotFound("User not registered");

      const isMatch = await user.isValidPassword(result.password);
      if (!isMatch)
        throw createError.Unauthorized("username/password not valid");

      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);
      // console.log(accessToken,refreshToken);

      res.send({ accessToken, refreshToken });
    } catch (error) {
      // if error messsage for password need to give proper message
      // console.log(error.isJoi);
      if (error.isJoi === true)
        return next(createError.BadRequest("Invalid username/password"));
      next(error);
    }
  },
  refresh_token: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw createError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken);
      const newAccessToken = await signAccessToken(userId);
      const newRefreshToken = await signRefreshToken(userId);
      res.send({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw createError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken);
      async function deleteRedisKey(userId) {
        let result = await client.del(userId);
        if (!result) {
          console.log(err.message);
          throw createError.InternalServerError();
        }
        res.sendStatus(204);
      }
      deleteRedisKey(userId);
      // client.del(userId,(err,value)=>{
      //   if(err){
      //     console.log(err.message);
      //     throw createError.InternalServerError();
      //   }
      //   console.log(value);
      //   res.sendStatus(204);
      // })
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
};
