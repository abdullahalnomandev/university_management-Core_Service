
import express from 'express';
import { RoomController } from './room.controller';

const router = express.Router();

router.post('/',RoomController.insertIntoDB)
router.get('/',RoomController.getAllFromDB)


export const RoomRoutes = router;