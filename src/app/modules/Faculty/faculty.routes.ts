import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyController } from './faculty.controller';
import { FacultyValidation } from './faculty.valildation';

const router = express.Router();

router.post(
  '/',
  validateRequest(FacultyValidation.create),
  FacultyController.insertIntoDB
);
router.get('/', FacultyController.getAllFromDB);
router.get('/:id', FacultyController.getDataById);

export const FacultyRoutes = router;
