import {
  Prisma,
  SemesterRegistration,
  SemesterRegistrationStatus,
  StudentSemesterRegistration,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import {
  semesterRegistrationRelationalFields,
  semesterRegistrationRelationalFieldsMapper,
  semesterRegistrationSearchableFields,
} from './semesterRegistration.constant';
import {
  IEnrollCoursePayload,
  ISemesterRegistrationFilterRequest,
} from './semesterRegistration.interface';

const insertIntoDb = async (
  data: SemesterRegistration
): Promise<SemesterRegistration> => {
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
  return await prisma.semesterRegistration.create({ data });
};

const getSingleFromDb = async (
  id: string
): Promise<SemesterRegistration | null> => {
  return await prisma.semesterRegistration.findUnique({
    where: { id },
    include: {
      academicSemester: true,
    },
  });
};

const getAllFromDB = async (
  filters: ISemesterRegistrationFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<SemesterRegistration[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: semesterRegistrationSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (semesterRegistrationRelationalFields.includes(key)) {
          return {
            [semesterRegistrationRelationalFieldsMapper[key]]: {
              id: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.SemesterRegistrationWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.semesterRegistration.findMany({
    include: {
      academicSemester: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.semesterRegistration.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const deleteByIdFromDB = async (id: string): Promise<SemesterRegistration> => {
  const result = await prisma.semesterRegistration.delete({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
  });
  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<SemesterRegistration>
): Promise<SemesterRegistration> => {
  console.log(payload.status);

  const isExist = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Data not found');
  }

  if (
    payload.status &&
    isExist.status === SemesterRegistrationStatus.UPCOMEING &&
    payload.status !== SemesterRegistrationStatus.ONGOING
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Can only move for UPCOMING to ONGOING '
    );
  }
  if (
    payload.status &&
    isExist.status === SemesterRegistrationStatus.ONGOING &&
    payload.status !== SemesterRegistrationStatus.ENDED
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Can only move for ONGOING to ENDED '
    );
  }

  const result = await prisma.semesterRegistration.update({
    where: {
      id,
    },
    data: payload,
    include: {
      academicSemester: true,
    },
  });

  return result;
};

const startMyRegistration = async (
  authUserId: string
): Promise<
  | {
      semesterRegistration: SemesterRegistration;
      studentSemesterRegistration: StudentSemesterRegistration;
    }
  | any
> => {
  const studentInfo = await prisma.student.findFirst({
    where: {
      studentId: authUserId,
    },
  });
  if (!studentInfo) {
    throw new ApiError(httpStatus.BAD_GATEWAY, 'Student Info not found');
  }

  const semesterRegistrationInfo = await prisma.semesterRegistration.findFirst({
    where: {
      status: {
        in: [
          SemesterRegistrationStatus.ONGOING,
          SemesterRegistrationStatus.UPCOMEING,
        ],
      },
    },
  });

  if (
    semesterRegistrationInfo?.status === SemesterRegistrationStatus.UPCOMEING
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Registration is not started yet'
    );
  }

  let studentRegistration = await prisma.studentSemesterRegistration.findFirst({
    where: {
      id: studentInfo?.id,
      semesterRegistration: {
        id: semesterRegistrationInfo?.id,
      },
    },
  });

  if (!studentRegistration) {
    studentRegistration = await prisma.studentSemesterRegistration.create({
      data: {
        student: {
          connect: {
            id: studentInfo?.id,
          },
        },
        semesterRegistration: {
          connect: {
            id: semesterRegistrationInfo?.id,
          },
        },
      },
    });
  }

  return {
    semesterRegistration: semesterRegistrationInfo,
    studentSemesterRegistration: studentRegistration,
  };
};

const enrollIntoCourse = async (
  authUserId: string,
  payload: IEnrollCoursePayload
) => {
  console.log(authUserId, payload);
  const student = await prisma.student.findFirst({
    where: {
      studentId: authUserId,
    },
  });

  console.log('student', student);

  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
  });

  console.log('object', semesterRegistration);

  const offeredCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: payload.offerCourseId,
    },
    include:{
      course:true
    }
  });

  const offeredCourseSection = await prisma.offeredCourseSection.findFirst({
    where: {
      id: payload.offerCourseSectionId,
    },
  });

  if (!offeredCourse) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Offer Course not found');
  }
  if (!offeredCourseSection) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Offer Course section not found');
  }
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }

  if (!semesterRegistration) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Semester Registration not found');
  }

  if (
    offeredCourseSection.maxCapacity &&
    offeredCourseSection.currentlyEnrolledStudent &&
    offeredCourseSection.currentlyEnrolledStudent >= offeredCourseSection.maxCapacity
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Student capacity is full.');

  }

  await prisma.$transaction(async transactionClient => {
    await transactionClient.studentSemesterRegistrationCourse.create({
      data: {
        studentId: student?.id,
        semesterRegistrationId: semesterRegistration?.id,
        offerCourseId: payload.offerCourseId,
        offerCourseSectionId: payload.offerCourseSectionId,
      },
    });

    await transactionClient.offeredCourseSection.update({
      where: {
        id: payload.offerCourseSectionId,
      },
      data: {
        currentlyEnrolledStudent: {
          increment: 1,
        },
      },
    });

    await transactionClient.studentSemesterRegistration.updateMany({
      where:{
        student:{
          id:student.id
        },
        semesterRegistration:{
          id:semesterRegistration.id
        }
      },
      data:{
        totalCreditsToken:{
          increment:offeredCourse.course.credits
        }
      }
    })
  });

  return {
    message:"Successfully enrolled into course"
  };
};
export const SemesterRegistrationService = {
  insertIntoDb,
  getSingleFromDb,
  getAllFromDB,
  deleteByIdFromDB,
  updateOneInDB,
  startMyRegistration,
  enrollIntoCourse,
};
