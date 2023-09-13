import express from 'express';
import { CourseController } from './course.controller';

const router = express.Router();

router.post('/', CourseController.insertIntoDB);
router.get('/:id', CourseController.getByID);
router.get('/', CourseController.getAllFromDB);
router.patch(
  '/:id',
  // auth(ENUM_USER_ROLE.SUPER_ADMIN),
  CourseController.updateOneInDB
);

export const CourseRoutes = router;
