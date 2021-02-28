import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';
class UserController {
  async create (request: Request, response: Response) {
    const {email, name} = request.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required()
    });

    try {
      await schema.validate(request.body, {abortEarly: false});
    } catch (error) {
      throw new AppError(error, 400);
    }

    const userRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await userRepository.findOne({
      email
    });

    if (userAlreadyExists) {
      throw new AppError('Este usuário já existe', 400);
    }

    const user = userRepository.create({
      name: name,
      email: email
    });

    await userRepository.save(user);

    return response.status(201).send(user);
  }
}

export {
  UserController
};
