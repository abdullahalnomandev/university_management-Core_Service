import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { roomFilterableFields } from "./room.constant";
import { RoomService } from "./room.service";


const insertIntoDB = catchAsync(async(req:Request, res:Response)=>{
    const result = await RoomService.insertIntoDB(req.body);
    sendResponse(res,{
        status:'success',
        statusCode:httpStatus.OK,
        message:"Room created successfully",
        data:result
    })
})

const getAllFromDB = catchAsync(async(req:Request, res:Response)=>{
  const filters = pick(req.query, roomFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await RoomService.getAllFromDB(filters, options); 
     sendResponse(res,{
        status:'success',
        statusCode:httpStatus.OK,
        message:"Room fetched successfully",
        data:result
    })
})

export const RoomController ={
    insertIntoDB,
    getAllFromDB
}