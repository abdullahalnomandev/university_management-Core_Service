import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.valildation';

const router = express.Router();

router.post(
  '/',
  // auth(ENUM_USER_ROLE.SUPER_ADMIN,ENUM_USER_ROLE.ADMIN),
  validateRequest(StudentValidation.create),
  StudentController.insertIntoDB
);
router.get('/', StudentController.getAllFromDB);
router.get('/:id', StudentController.getDataById);
router.patch('/:id', validateRequest(StudentValidation.update), StudentController.updateIntoDB);
router.patch('/:id', StudentController.deletFromDB);

export const StudentRoutes = router;
