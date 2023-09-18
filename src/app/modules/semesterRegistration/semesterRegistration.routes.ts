
import express from 'express';
import { SemesterRegistrationController } from './semesterRegistration.controller';

const router = express.Router();

router.post('/',SemesterRegistrationController.insertIntoDb)

export const semesterRegistrationRoutes = router;