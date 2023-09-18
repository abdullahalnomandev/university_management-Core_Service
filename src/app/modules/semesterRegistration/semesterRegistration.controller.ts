import { SemesterRegistrationStatus } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import { prisma } from '../../../shared/prisma';
import sendResponse from '../../../shared/sendResponse';
import { SemesterRegistrationService } from './semesterRegistration.service';

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const isAnySemesterRegUpcomingOrOngoing =
    await prisma.semesterRegistration.findFirst({
      where: {
        OR: [
          {
            status: SemesterRegistrationStatus.UPCOMEING,
          },
          {
            status: SemesterRegistrationStatus.ONGOING,
          },
        ],
      },
    });

  if (isAnySemesterRegUpcomingOrOngoing) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `There is already an ${isAnySemesterRegUpcomingOrOngoing.status} registration`
    );
  }
  const result = await SemesterRegistrationService.insertIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Semester registration created successfully',
    data: result,
  });
});

export const SemesterRegistrationController = {
  insertIntoDb,
};
