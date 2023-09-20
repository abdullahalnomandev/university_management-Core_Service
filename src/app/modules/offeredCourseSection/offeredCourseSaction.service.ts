import { OfferedCourseSection } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { prisma } from '../../../shared/prisma';

const insertIntoDb = async (  data: any): Promise<OfferedCourseSection> => {

    const isExistOfferedCourse = await prisma.offeredCourse.findFirst({
        where:{
            id:data.offeredCourseId
        }
    })
     
    if(!isExistOfferedCourse){
        throw new ApiError (httpStatus.BAD_REQUEST,"Offered Course does not exist")
    }

    data.semesterRegistrationId = isExistOfferedCourse.semesterRegistrationId;

  return prisma.offeredCourseSection.create({
    data,
    include: { offeredCourse: true, semesterRegistration: true },
  });
};

export const OfferedCourseSectionService = {
  insertIntoDb,
};
