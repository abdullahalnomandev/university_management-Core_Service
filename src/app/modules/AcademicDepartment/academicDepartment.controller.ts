import { AcademicFaculty } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { AcademicDepartmentService } from './academicDepartment.service';
import { AcademicDepartmentFilterAbleFields } from './academicFaculty.constant';


const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicDepartmentService.insertIntoDB(req.body);
  sendResponse<AcademicFaculty>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Academic Faculty created',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {

   
   const filters = pick(req.query,AcademicDepartmentFilterAbleFields);
   const options = pick (req.query,['limit','page','sortBy','sortOrder'])


  const result = await AcademicDepartmentService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Academic semester data fetched.',
    meta: result.meta,
    data: result.data
  });
});
const getDataById = catchAsync(async (req: Request, res: Response) => {
  
  const result = await AcademicDepartmentService.getDataById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Academic semester data fetched.',
    data: result
  });
});




export const AcademicDepartmentController = {
  insertIntoDB,
  getAllFromDB,
  getDataById
};
