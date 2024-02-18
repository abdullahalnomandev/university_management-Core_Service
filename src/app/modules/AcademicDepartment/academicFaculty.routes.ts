import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentController } from './academicDepartment.controller';
import { AcademicDepartmentValidation } from './academicDepartment.validation';

const router = express.Router();

router.post('/',
  validateRequest(AcademicDepartmentValidation.create),
  AcademicDepartmentController.insertIntoDB
);
router.get('/', AcademicDepartmentController.getAllFromDB);
router.get('/:id', AcademicDepartmentController.getDataById);

export const AcademicDepartmentRoutes = router;
