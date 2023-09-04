import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyController } from './academicFaculty.controller';
import { AcademicFacultyValidation } from './academicFaculty.validation';

const router = express.Router();

router.post(
'/create-academic-faculty',
  validateRequest(AcademicFacultyValidation.create),
  AcademicFacultyController.insertIntoDB
);
router.get(
  '/',
  AcademicFacultyController.getAllFromDB
);
router.get('/:id', AcademicFacultyController.getDataById);

export const AcademicFacultyRoutes = router;
