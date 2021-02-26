import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';

class UserController {
  async create (request: Request, response: Response) {
    const {email, name} = request.body;

    const userRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await userRepository.findOne({
      email
    });

    if (userAlreadyExists) {
      return response.status(400).json({
        message: 'Este usuário já existe'
      });
    }

    const user = userRepository.create({
      name: name,
      email: email
    });

    await userRepository.save(user);

    return response.send(user);
  }
}

export {
  UserController
};
