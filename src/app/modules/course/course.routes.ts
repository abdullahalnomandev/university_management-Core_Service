import express from 'express';
import { CourseController } from './course.controller';

const router = express.Router();

router.post('/', CourseController.insertIntoDB);
router.get('/:id', CourseController.getByID);
router.get('/', CourseController.getAllFromDB);
router.post('/:id/assign-faculties', CourseController.assignFaculties);
router.post('/:id/assign-faculties', CourseController.assignFaculties);
router.delete('/:id/remove-faculties', CourseController.removeFaculties);
router.patch(
  '/:id',
  // auth(ENUM_USER_ROLE.SUPER_ADMIN),
  CourseController.updateOneInDB
);

export const CourseRoutes = router;
