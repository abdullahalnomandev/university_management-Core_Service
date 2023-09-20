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

const getAllFromDb = catchAsync(async(req:Request,res:Response) => {
    const result = await OfferedCourseSectionService.getAllFromDb();
    sendResponse(res,{
        statusCode:httpStatus.OK,
        status:'success',
        message:"Data fetched successfully",
        data:result
    })
})

const getSingleOne = catchAsync(async(req:Request,res:Response) => {
    const result = await OfferedCourseSectionService.getSingleOneFromDB(req.params.id);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        status:'success',
        message:"Data fetched successfully",
        data:result
    })
})

const deleteFromDb = catchAsync(async(req:Request,res:Response) => {
    const result = await OfferedCourseSectionService.deleteFromDb(req.params.id);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        status:'success',
        message:"Data Deleted successfully",
        data:result
    })
})


export const OfferedCourseSectionController = {
  insertIntoDb,
  getSingleOne,
  deleteFromDb,
  getAllFromDb
};