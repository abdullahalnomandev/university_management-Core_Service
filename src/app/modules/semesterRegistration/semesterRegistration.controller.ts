import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { semesterRegistrationFilterableFields } from './semesterRegistration.constant';
import { SemesterRegistrationService } from './semesterRegistration.service';

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {

  const result = await SemesterRegistrationService.insertIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Semester registration created successfully',
    data: result,
  });
});
const getSingleFromDb = catchAsync(async (req: Request, res: Response) => {


  const result = await SemesterRegistrationService.getSingleFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Semester registration fetched successfully',
    data: result,
  });
});




const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, semesterRegistrationFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await SemesterRegistrationService.getAllFromDB(
    filters,
    options
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    status:"success",
    message: 'SemesterRegistrations fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});


const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SemesterRegistrationService.deleteByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    status:"success",
    message: 'SemesterRegistration deleted successfully',
    data: result,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SemesterRegistrationService.updateOneInDB(id,req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    status:"success",
    message: 'SemesterRegistration deleted successfully',
    data: result,
  });
});

const startMyRegistration = catchAsync(async (req: Request, res: Response) => {

  const user = (req as any).user
  const result = await SemesterRegistrationService.startMyRegistration(user.userId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    status:"success",
    message: 'Student SemesterRegistration started successfully',
    data: result,
  });
});

const enrollIntoCourse = catchAsync(async (req: Request, res: Response) =>{

    const user = (req as any).user

    const result = await SemesterRegistrationService.enrollIntoCourse(user.userId,req.body)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      status: 'success',
      message: 'Student SemesterRegistration course enrolled successfully',
      data: result,
    });
})

const withdrawFromCourse = catchAsync(async (req: Request, res: Response) =>{

    const user = (req as any).user

    const result = await SemesterRegistrationService.withrowFromCourse(user.userId,req.body)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      status: 'success',
      message: 'Student  withdraw successfully',
      data: result,
    });
})

const confirmMyRegistration = catchAsync(async (req: Request, res: Response) =>{

    const user = (req as any).user

    const result = await SemesterRegistrationService.confirmMyRegistration(user.userId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      status: 'success',
      message: 'Confirm your registration',
      data: result,
    });
})
const getMyRegistration = catchAsync(async (req: Request, res: Response) =>{
    const user = (req as any).user
    const result = await SemesterRegistrationService.getMyRegistration(user.userId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      status: 'success',
      message: 'My registration data fetched successfully',
      data: result,
    });
})

const startNewSemester = catchAsync(async (req: Request, res: Response) =>{

  const { id} = req.params;
  const result = await SemesterRegistrationService.startNewSemester(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      status: 'success',
      message: 'Semester Started successfully',
      data: result,
    });
})


const getMySemesterCourses = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await SemesterRegistrationService.getMySemesterRegCourses( user.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'My registration courses data fatched!',
    data: result,
  });
});

export const SemesterRegistrationController = {
  insertIntoDb,
  getSingleFromDb,
  getAllFromDB,
  deleteByIdFromDB,
  updateOneInDB,
  startMyRegistration,
  enrollIntoCourse,
  withdrawFromCourse,
  confirmMyRegistration,
  getMyRegistration,
  startNewSemester,
  getMySemesterCourses
};
