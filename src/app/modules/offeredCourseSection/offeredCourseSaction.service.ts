import { OfferedCourseSection } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { prisma } from '../../../shared/prisma';
import { asyncForEach } from '../../../shared/utils';
import { OfferedCourseClassScheduleUtils } from './../offeredCourseClassSchedule/offeredCourseClasses.utils';

const insertIntoDb = async (payload: any): Promise<any> => {
  const { classSchedules, ...data } = payload;

  const isExistOfferedCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: data.offeredCourseId,
    },
  });

  if (!isExistOfferedCourse) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Offered Course does not exist');
  }

  data.semesterRegistrationId = isExistOfferedCourse.semesterRegistrationId;

  await asyncForEach(classSchedules, async (schedule: any) => {
    await OfferedCourseClassScheduleUtils.checkRoomAvailable(schedule);
    await OfferedCourseClassScheduleUtils.checkFacultyAvailabe(schedule);
  });

  const createSection = await prisma.$transaction(async transactionClient => {
    const createOfferedCourseSection =
      await transactionClient.offeredCourseSection.create({
        data,
        include: { offeredCourse: true, semesterRegistration: true },
      });

    const scheduleData = classSchedules.map((schedule: any) => ({
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      dayOfWeek: schedule.dayOfWeek,
      roomId: schedule.roomId,
      facultyId: schedule.facultyId,
      offeredCourseSection: createOfferedCourseSection.id,
      semesterRegistrationid: isExistOfferedCourse.semesterRegistrationId,
    }));

    const createSchedule = await transactionClient.offeredCourseClassSchedule.createMany({
        data: scheduleData,
      });
    return createSchedule;
  });
console.log(createSection);
};

const getAllFromDb = async (): Promise<OfferedCourseSection[]> => {
  const result = prisma.offeredCourseSection.findMany({
    include: {
      offeredCourse: true,
      semesterRegistration: true,
    },
  });

  return result;
};

const getSingleOneFromDB = async (
  id: string
): Promise<OfferedCourseSection | null> => {
  const result = prisma.offeredCourseSection.findUnique({
    where: {
      id,
    },
    include: {
      offeredCourse: true,
      semesterRegistration: true,
    },
  });
  return result;
};
const deleteFromDb = async (
  id: string
): Promise<OfferedCourseSection | null> => {
  const result = prisma.offeredCourseSection.delete({
    where: {
      id,
    },
    include: {
      offeredCourse: true,
      semesterRegistration: true,
    },
  });
  return result;
};

export const OfferedCourseSectionService = {
  insertIntoDb,
  getAllFromDb,
  getSingleOneFromDB,
  deleteFromDb,
};
