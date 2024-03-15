const UserDto = require("../dtos/userDTO");
const userSchema = require("../models/userSchema");
const tokenService = require("./tokenService");
const bcrypt = require("bcrypt");

class UserService {
  async registration(name, email, password) {
    const candidate = await userSchema.findOne({ email });
    if (candidate != null) {
      throw new Error(`Введено пошту існуючого користувача: ${email}`);
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const user = await userSchema.create({
      name,
      email,
      password: hashPassword,
    });

    const userDto = new UserDto(user); // email, id
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async login(email, password) {
    const user = await userSchema.findOne({ email });
    if (!user) {
      throw new Error(`Користувача з електронною поштою ${email} не знайдено.`);
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw new Error(`Не правильно введений пароль.`);
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new Error(`Token is null`);
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw new Error(`Ви не пройшли авторизацію`);
    }
    const user = await userSchema.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }
}

module.exports = new UserService();
