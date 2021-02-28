import { Router } from 'express';
import { AnswerController } from '../controllers/AnswerController';
import { NpsController } from '../controllers/NpsController';
import { SendMailController } from '../controllers/SendMailController';
import { SurveysController } from '../controllers/SurveysController';
import { UserController } from '../controllers/UserController';
const router = Router();

const userController = new UserController();
router.post('/users', userController.create);

const surveysController = new SurveysController();
router.get('/surveys', surveysController.findAll);
router.post('/surveys', surveysController.create);

const sendMailController = new SendMailController();
router.post('/send-mail', sendMailController.execute);

const answerController = new AnswerController();
router.get('/answers/:value', answerController.execute);

const npsController = new NpsController();
router.get('/nps/:survey_id', npsController.execute);

export {
  router
}