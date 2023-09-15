import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CourseService } from './course.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.insertIntoDB(req.body);
  sendResponse(res, {
    status: 'success',
    statusCode: httpStatus.OK,
    message: 'Course created successfully',
    data: result,
  });
});
const getByID = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.getById(req.params.id);
  sendResponse(res, {
    status: 'success',
    statusCode: httpStatus.OK,
    message: 'Course fetched successfully',
    data: result,
  });
});
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.getAllFromDB();
  sendResponse(res, {
    status: 'success',
    statusCode: httpStatus.OK,
    message: 'Course fetched successfully',
    data: result,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CourseService.updateOneInDB(id, req.body);
  sendResponse(res, {
    status: 'success',
    statusCode: httpStatus.OK,
    message: 'Course updated successfully',
    data: result,
  });
});

const assignFaculties = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CourseService.assignFaculties(id, req.body.faculties);
  sendResponse(res, {
    status: 'success',
    statusCode: httpStatus.OK,
    message: 'Course faculty assigned successfully',
    data: result,
  });
});

const removeFaculties = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CourseService.removeFaculties(id, req.body.faculties);
  sendResponse(res, {
    status: 'success',
    statusCode: httpStatus.OK,
    message: 'Course faculty deleted successfully',
    data: result,
  });
});

export const CourseController = {
  insertIntoDB,
  updateOneInDB,
  getByID,
  getAllFromDB,
  assignFaculties,
  removeFaculties
};
