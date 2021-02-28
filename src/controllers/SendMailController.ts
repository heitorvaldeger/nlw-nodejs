import { Request, Response } from 'express';
import { getCustomRepository } from "typeorm";
import { resolve } from 'path';
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from '../services/SendMailService';

class SendMailController {
  async execute (request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRepository.findOne({
      email
    });

    if (!user) {
      return response.status(400).json({
        error: 'User does not exists'
      });
    }

    const survey = await surveysRepository.findOne({
      id: survey_id
    });

    if (!survey) {
      return response.status(400).json({
        error: 'Survey does not exists'
      });
    }

    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

    const variables = {
      username: user.name,
      title: survey.title,
      description: survey.description,
      id: '',
      link: process.env.URL_MAIL
    }

    let surveyUser = await surveysUsersRepository.findOne({
      where: {user_id: user.id, value: null}
    });

    if (!surveyUser) {
      surveyUser = surveysUsersRepository.create({
        user_id: user.id,
        survey_id: survey.id
      });

      variables.id = surveyUser.id;

      await surveysUsersRepository.save(surveyUser);
    }

    variables.id = surveyUser.id;
    await SendMailService.execute(email, survey.title, variables, npsPath);

    return response.status(201).json(surveyUser);
  }
}

export {
  SendMailController
}