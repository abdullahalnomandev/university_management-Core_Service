import express from 'express';
import { OfferedCourseSectionController } from './offeredCourseSaction.controller';

const router = express.Router();

router.post('/', OfferedCourseSectionController.insertIntoDb)
router.get('/:id', OfferedCourseSectionController.getSingleOne)
router.get('/', OfferedCourseSectionController.getAllFromDb)
router.delete('/:id', OfferedCourseSectionController.deleteFromDb)

export const OfferedCourseSectionRoutes = router;