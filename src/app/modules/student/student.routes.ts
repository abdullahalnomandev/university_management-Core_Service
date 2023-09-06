import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.valildation';

const router = express.Router();

router.post(
  '/',
  validateRequest(StudentValidation.create),
  StudentController.insertIntoDB
);
router.get('/', StudentController.getAllFromDB);
router.get('/:id', StudentController.getDataById);

export const AcademicSemesterRoutes = router;
