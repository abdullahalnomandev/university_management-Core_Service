import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { studentEnrolledCourseMarkFilterableFields } from "./studentEnrolledCourseMark.constant";
import { StudentEnrolledCourseMarkService } from "./studentEnrolledCourseMark.service";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, studentEnrolledCourseMarkFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await StudentEnrolledCourseMarkService.getAllFromDB(
    filters,
    options
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Student course marks fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getMyCourseMarks = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, studentEnrolledCourseMarkFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const user = (req as any).user;

  const result = await StudentEnrolledCourseMarkService.getMyCourseMarks(
    filters,
    options,
    user
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Student course marks fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});


const updateStudentMarks = catchAsync(async (req:Request,res:Response)=>{
    const result = await StudentEnrolledCourseMarkService.updateStudentMarks(req.body)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        status:'success',
        message:'Marks updated successfully',
        data:result
    })
})

const updateFinalMarks = catchAsync(async (req, res) =>{
    const result = await StudentEnrolledCourseMarkService.updateFinalMarks(req.body)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        status:'success',
        message:'Final marks updated!',
        data:result
    })
})

export const StudentEnrolledCourseMarkController = {
  updateStudentMarks,
  updateFinalMarks,
  getMyCourseMarks,
  getAllFromDB
};