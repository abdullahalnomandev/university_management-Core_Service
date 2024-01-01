import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StudentEnrolledCourseMarkService } from "./studentEnrolledCourseMark.service";


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

export const StudentEnrolledCourseMarkController ={
    updateStudentMarks,
    updateFinalMarks
}