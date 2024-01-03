import { OfferedCourseSection } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { prisma } from '../../../shared/prisma';
import { asyncForEach } from '../../../shared/utils';
import { OfferedCourseClassScheduleUtils } from './../offeredCourseClassSchedule/offeredCourseClasses.utils';
import { IClassSchedule, IOfferedCourseSectionCreate } from './offeredCourseSactionInterfact.interface';

const insertIntoDb = async (
  payload: IOfferedCourseSectionCreate
): Promise<OfferedCourseSection | null> => {
  const { classSchedules, ...data } = payload;

  const isExistOfferedCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: data.offeredCourseId,
    },
  });

  if (!isExistOfferedCourse) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Offered Course does not exist');
  }

  await asyncForEach(classSchedules, async (schedule: any) => {
    await OfferedCourseClassScheduleUtils.checkRoomAvailable(schedule);
    await OfferedCourseClassScheduleUtils.checkFacultyAvailabe(schedule);
  });

  const offeredCourseSectionData = await prisma.offeredCourseSection.findFirst({
    where: {
      offeredCourse: {
        id: data.offeredCourseId,
      },
      title: data.title,
    },
  });

  if (offeredCourseSectionData) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Course Section already exists');
  }
  const createSection = await prisma.$transaction(async transactionClient => {
    const createOfferedCourseSection =
      await transactionClient.offeredCourseSection.create({
        data: {
          title: data.title,
          maxCapacity: data.maxCapacity,
          offeredCourseId: data.offeredCourseId,
          semesterRegistrationId:isExistOfferedCourse.semesterRegistrationId,
        },
        include: { offeredCourse: true, semesterRegistration: true },
      });

    const scheduleData = classSchedules.map((schedule: IClassSchedule) => ({
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      dayOfWeek: schedule.dayOfWeek,
      roomId: schedule.roomId,
      facultyId: schedule.facultyId,
      offeredCourseSectionId: createOfferedCourseSection.id,
      semesterRegistrationid: isExistOfferedCourse.semesterRegistrationId,
    }));

    await transactionClient.offeredCourseClassSchedule.createMany({
      data: scheduleData,
    });
    return createOfferedCourseSection;
  });

  const result = await prisma.offeredCourseSection.findFirst({
    where: {
      id: createSection.id,
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      offeredCourseClassSchedules: {
        include: {
          room: {
            include: {
              building: true,
            },
          },
          facylty: true,
        },
      },
    },
  });

  return result;
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
