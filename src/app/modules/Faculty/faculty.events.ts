import { RedisClient } from '../../../shared/redis';
import {
    EVENT_FACULTY_CREATED,
    EVENT_FACULTY_UPDATED,
} from './faculty.constant';
import { FacultyCreatedEvent } from './faculty.interface';
import { FacultyService } from './faculty.service';

const initFacultyEvents = () => {
  RedisClient.subscribe(EVENT_FACULTY_CREATED, async (e: string) => {
    const data: FacultyCreatedEvent = JSON.parse(e);

    await FacultyService.createFacultyFromEvent(data);
  });

  RedisClient.subscribe(EVENT_FACULTY_UPDATED, async (e: string) => {
    const data = JSON.parse(e);
    console.log('got event', data);

    await FacultyService.updateFacultyFromEvent(data);
  });
};

export default initFacultyEvents;
