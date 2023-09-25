import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BuildingController } from './building.controller';
import { BuildingValidations } from './building.validation';


const router = express.Router();

router.post(
  '/',
  // auth(ENUM_USER_ROLE.SUPER_ADMIN,ENUM_USER_ROLE.ADMIN),
  validateRequest(BuildingValidations.create),
  BuildingController.insertIntoDB
);
router.get('/',BuildingController.getAllFromDB)
// router.get('/', AcademicFacultyController.getAllFromDB);
// router.get('/:id', AcademicFacultyController.getDataById);

export const BuildingRoutes = router;
