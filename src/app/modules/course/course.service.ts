import { Course } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { prisma } from '../../../shared/prisma';
import { ICourseCreateData } from './course.interface';

const insertIntoDB = async (data: ICourseCreateData): Promise<any> => {
  const { preRequisiteCourses, ...courseData } = data;

  const newCourse = await prisma.$transaction(async transactionClient => {
    const result = await transactionClient.course.create({ data: courseData });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create course');
    }

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      for (let index = 0; index < preRequisiteCourses.length; index++) {
        const createPrerequisite =
          await transactionClient.courseToPrerequisite.create({
            data: {
              courseId: result.id,
              prerequisiteId: preRequisiteCourses[index].courseId,
            },
          });
        console.log('Createprerequisites', createPrerequisite);
      }
    }
    return result;
  });

  if (newCourse) {
    const responseData = await prisma.course.findUnique({
      where: {
        id: newCourse.id,
      },
      include: {
        preRequisite: {
          include: {
            preRequisite: true,
          },
        },
        preRequisiteFor: {
          include: {
            courses: true,
          },
        },
      },
    });
    return responseData;
  }

  throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create course');
};

// UPDATE Course
const updateOneInDB = async (
  id: string,
  payload: ICourseCreateData
): Promise<Course | null> => {
  const { preRequisiteCourses, ...courseData } = payload;

  await prisma.$transaction(async transactionClient => {
    const result = await transactionClient.course.update({
      where: {
        id,
      },
      data: courseData,
    });

    if (!result) {
      new ApiError(httpStatus.BAD_REQUEST, 'Unable to update course');
    }

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      const deletePrerequisite = preRequisiteCourses.filter(
        ({ courseId, isDeleted }) => courseId && isDeleted
      );

      const newPrerequisites = preRequisiteCourses.filter(
        ({ courseId, isDeleted }) => courseId && !isDeleted
      );

      for (let index = 0; index < deletePrerequisite.length; index++) {
        await transactionClient.courseToPrerequisite.deleteMany({
          where: {
            AND: [
              {
                courseId: id,
              },
              {
                prerequisiteId: deletePrerequisite[index].courseId,
              },
            ],
          },
        });
      }
 
      console.log(newPrerequisites);
      
      for (let index = 0; index < newPrerequisites.length; index++) {
        await transactionClient.courseToPrerequisite.create({
          data: {
            courseId: id,
            prerequisiteId: newPrerequisites[index].courseId
          },
        });
      }
    }
    return result;
  });

  const responseData = await prisma.course.findUnique({
    where: {
      id: id,
    },
    include: {
      preRequisite: {
        include: {
          preRequisite: true,
        },
      },
      preRequisiteFor: {
        include: {
          courses: true,
        },
      },
    },
  });
  return responseData;
};

// GET COURSE
const getById = async (id: string): Promise<Course | null> => {
  const responseData = await prisma.course.findUnique({
    where: {
      id,
    },
    include: {
      preRequisite: {
        include: {
          preRequisite: true,
        },
      },
      preRequisiteFor: {
        include: {
          courses: true,
        },
      },
    },
  });
  return responseData;
};
const getAllFromDB = async (): Promise<Course []> => {
  const responseData = await prisma.course.findMany({
    include: {
      preRequisite: {
        include: {
          preRequisite: true,
        },
      },
      preRequisiteFor: {
        include: {
          courses: true,
        },
      },
    },
  });
  return responseData;
};
export const CourseService = {
  insertIntoDB,
  updateOneInDB,
  getById,
  getAllFromDB
};
