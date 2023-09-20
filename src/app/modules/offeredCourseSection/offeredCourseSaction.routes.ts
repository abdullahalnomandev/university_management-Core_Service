import express from 'express';
import { OfferedCourseSectionController } from './offeredCourseSaction.controller';

const router = express.Router();

router.post('/', OfferedCourseSectionController.insertIntoDb)

export const OfferedCourseSectionRoutes = router;