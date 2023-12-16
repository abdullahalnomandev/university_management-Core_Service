import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import { SemesterRegistrationValidation } from './semesterRegistration.validation';

const router = express.Router();

router.get(
  '/get-my-registration',
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.getMyRegistration
);

router.post(
  '/',
  validateRequest(SemesterRegistrationValidation.create),
  SemesterRegistrationController.insertIntoDb
);
router.get('/', SemesterRegistrationController.getAllFromDB);
router.get('/:id', SemesterRegistrationController.getSingleFromDb);
router.delete('/:id', SemesterRegistrationController.deleteByIdFromDB);

router.post('/start-registration',
auth(ENUM_USER_ROLE.STUDENT),
SemesterRegistrationController.startMyRegistration)

router.patch(
  '/:id',
  validateRequest(SemesterRegistrationValidation.update),
  SemesterRegistrationController.updateOneInDB
);

router.post(
  '/enroll-into-course',
  validateRequest(SemesterRegistrationValidation.entollOrWithdrawCourse),
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.enrollIntoCourse
);


router.post(
  '/withdraw-from-course',
  validateRequest(SemesterRegistrationValidation.entollOrWithdrawCourse),
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.withdrawFromCourse
);

router.post(
  '/confirm-my-registration',
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.confirmMyRegistration
);


router.post(
  '/:id/start-new-semester',
  SemesterRegistrationController.startNewSemester
);



export const semesterRegistrationRoutes = router;
