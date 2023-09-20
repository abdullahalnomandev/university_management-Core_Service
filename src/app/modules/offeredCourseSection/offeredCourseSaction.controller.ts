import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { OfferedCourseSectionService } from "./offeredCourseSaction.service";

const insertIntoDb = catchAsync(async(req:Request,res:Response) => {

    const result = await OfferedCourseSectionService.insertIntoDb(req.body);

    sendResponse(res,{
        statusCode:httpStatus.OK,
        status:'success',
        message:"Offered Course Section created successfully",
        data:result
    })

})


export const OfferedCourseSectionController ={
    insertIntoDb
}