import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterController } from './academicSemester.controller';
import { AcademicSemesterValidation } from './academicSemester.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(AcademicSemesterValidation.create),
  // auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STUDENT),
  AcademicSemesterController.insertIntoDB
);
router.get(
  '/',
  AcademicSemesterController.getAllFromDB
);
router.get(
  '/:id',
  AcademicSemesterController.getDataById
);
router.patch(
  '/:id',
  AcademicSemesterController.updateOneInDB
);

router.delete(
  '/:id',
  AcademicSemesterController.deleteById
);


export const AcademicSemesterRoutes = router;
