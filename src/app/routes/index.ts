import express from 'express';
import { AcademicDepartmentRoutes } from '../modules/AcademicDepartment/academicFaculty.routes';
import { AcademicFacultyRoutes } from '../modules/AcademicFaculty/academicFaculty.routes';
import { FacultyRoutes } from '../modules/Faculty/faculty.routes';
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.routes';
import { StudentRoutes } from '../modules/student/student.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoutes,
  },
  {
    path: '/academic-faculty',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/academic-department',
    route: AcademicDepartmentRoutes,
  },
  {
    path: '/student',
    route: StudentRoutes,
  },
  {
    path: '/faculty',
    route: FacultyRoutes,
  }
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
