import { Faculty } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { facultyFilterableFields } from './faculty.constant';
import { FacultyService } from './faculty.service';


const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await FacultyService.insertIntoDB(req.body);
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: ' Faculty created',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, facultyFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await FacultyService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Academic semester data fetched.',
    meta: result.meta,
    data: result.data,
  });
});
const getDataById = catchAsync(async (req: Request, res: Response) => {
  const result = await FacultyService.getDataById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Academic semester data fetched.',
    data: result,
  });
});


const assignCourses = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FacultyService.assignCourses(id, req.body.courses);
  sendResponse(res, {
    status: 'success',
    statusCode: httpStatus.OK,
    message: 'Course faculty assigned successfully',
    data: result,
  });
});

const removeCourses = catchAsync(async (req: Request, res: Response) => {
  
  const { id } = req.params;
  const result = await FacultyService.removeCourses(id, req.body.courses);
  sendResponse(res, {
    status: 'success',
    statusCode: httpStatus.OK,
    message: 'Course faculty deleted successfully',
    data: result,
  });
});

const myCourses = catchAsync(async (req: Request, res: Response) => {

  const user = (req as any).user;
  const filter = pick(req.query,['academicSemesterId','courseId'])

  const result = await FacultyService.myCourses(user,filter)
  sendResponse(res, {
    status: 'success',
    statusCode: httpStatus.OK,
    message: 'My courses data fetched successfully!',
    data: result,
  });
});


export const FacultyController = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  assignCourses,
  removeCourses,
  myCourses
};
