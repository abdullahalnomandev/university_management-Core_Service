import express from 'express';
import { AcademicDepartmentRoutes } from '../modules/AcademicDepartment/academicFaculty.routes';
import { AcademicFacultyRoutes } from '../modules/AcademicFaculty/academicFaculty.routes';
import { FacultyRoutes } from '../modules/Faculty/faculty.routes';
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.routes';
import { BuildingRoutes } from '../modules/building/building.routes';
import { CourseRoutes } from '../modules/course/course.routes';
import { OfferedCourseRoutes } from '../modules/offeredCourse/offeredCourse.routes';
import { offeredCourseClassScheduleRoutes } from '../modules/offeredCourseClassSchedule/offeredCourseClassSchedule.route';
import { OfferedCourseSectionRoutes } from '../modules/offeredCourseSection/offeredCourseSaction.routes';
import { RoomRoutes } from '../modules/room/room.routes';
import { semesterRegistrationRoutes } from '../modules/semesterRegistration/semesterRegistration.routes';
import { StudentRoutes } from '../modules/student/student.routes';
import { StudentEnrolledCourseMarkRoutes } from '../modules/studentEnrolledCourseMark/studentEnrolledCourseMark.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoutes
  },
  {
    path: '/academic-faculty',
    route: AcademicFacultyRoutes
  },
  {
    path: '/academic-department',
    route: AcademicDepartmentRoutes
  },
  {
    path: '/students',
    route: StudentRoutes
  },
  {
    path: '/faculty',
    route: FacultyRoutes
  },
  {
    path: '/buildings',
    route: BuildingRoutes
  },
  {
    path: '/rooms',
    route: RoomRoutes
  },
  {
    path: '/courses',
    route: CourseRoutes
  },
  {
    path: '/semester-registrations',
    route: semesterRegistrationRoutes
  },
  {
    path: '/offered-courses',
    route: OfferedCourseRoutes
  },
  {
    path: '/offered-courses-sections',
    route: OfferedCourseSectionRoutes
  },
  {
    path: '/offered-courses-class-schedules',
    route: offeredCourseClassScheduleRoutes
  },
  {
    path: '/student-enrolled-course-marks',
    route: StudentEnrolledCourseMarkRoutes
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
