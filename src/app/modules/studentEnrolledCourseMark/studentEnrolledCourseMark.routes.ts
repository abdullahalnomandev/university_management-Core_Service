
import express from 'express';
import { StudentEnrolledCourseMarkController } from './studentEnrolledCourseMarkController';


const router = express.Router();

router.patch('/update-marks',StudentEnrolledCourseMarkController.updateStudentMarks)


export const StudentEnrolledCourseMarkRoutes = router;