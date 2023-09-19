
import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import { SemesterRegistrationValidation } from './semesterRegistration.validation';

const router = express.Router();

router.post('/',validateRequest(SemesterRegistrationValidation.create), SemesterRegistrationController.insertIntoDb)
router.get('/',SemesterRegistrationController.getAllFromDB)
router.get('/:id',SemesterRegistrationController.getSingleFromDb)
router.delete('/:id',SemesterRegistrationController.deleteByIdFromDB)
router.patch('/:id',SemesterRegistrationController.updateOneInDB)

export const semesterRegistrationRoutes = router;