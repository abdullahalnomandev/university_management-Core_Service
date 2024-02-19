import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { offeredCourseFilterableFields } from "./offeredCourse.constant";
import { OfferedCourseService } from "./offeredCourse.service";


const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
    const result =  await OfferedCourseService.insertIntoDB(req.body)
    sendResponse(res,{
        status:'success',
        statusCode:httpStatus.OK,
        message:"Offered Course created successfully",
        data:result,
    })


})

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, offeredCourseFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await OfferedCourseService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: "success",
    message: 'OfferedCourses fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OfferedCourseService.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: "success",
    message: 'OfferedCourse fetched successfully',
    data: result,
  });
});

export const OfferedCourseController ={
    insertIntoDb,
    getByIdFromDB,
    getAllFromDB
}