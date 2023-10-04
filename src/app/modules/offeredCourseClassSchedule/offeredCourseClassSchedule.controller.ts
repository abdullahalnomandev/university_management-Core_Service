import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { offeredCourseClassScheduleFilterableFields } from "./offeredCourseClassSchedule.constant";
import { OfferedCourseClassScheduleService } from "./offeredCourseClassSchedule.service";


const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseClassScheduleService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Offered Course Section created successfully',
    data: result,
  });
});


const getFromDb = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query,offeredCourseClassScheduleFilterableFields);
  const options = pick (req.query,['limit','page','sortBy','sortOrder'])
  const result = await OfferedCourseClassScheduleService.getAllFromDB(filters,options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Offered Course Section created successfully',
    data: result,
  });
});


export const OfferedCourseClassScheduleController = {
  insertIntoDb,
  getFromDb
};