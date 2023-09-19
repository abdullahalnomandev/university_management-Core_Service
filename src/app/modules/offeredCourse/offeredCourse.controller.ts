import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
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


export const OfferedCourseController ={
    insertIntoDb
}