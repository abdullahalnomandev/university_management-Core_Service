import express from 'express';
import { BuildingController } from './building.controller';


const router = express.Router();

router.post(
  '/',
  BuildingController.insertIntoDB
);
router.get('/',BuildingController.getAllFromDB)
// router.get('/', AcademicFacultyController.getAllFromDB);
// router.get('/:id', AcademicFacultyController.getDataById);

export const BuildingRoutes = router;
