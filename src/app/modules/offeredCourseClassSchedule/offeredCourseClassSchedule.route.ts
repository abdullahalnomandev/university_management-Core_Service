import express from 'express';
import { OfferedCourseClassScheduleController } from './offeredCourseClassSchedule.controller';

const router = express.Router();

router.post('/', OfferedCourseClassScheduleController.insertIntoDb);
router.get('/', OfferedCourseClassScheduleController.getFromDb);

export const offeredCourseClassScheduleRoutes = router;
