import { Course, CourseFaculty } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { prisma } from '../../../shared/prisma';
import { asyncForEach } from '../../../shared/utils';
import { ICourseCreateData, IPrequisiteCorseRequest } from './course.interface';

const insertIntoDB = async (data: ICourseCreateData): Promise<any> => {
  const { preRequisiteCourses, ...courseData } = data;

  const newCourse = await prisma.$transaction(async transactionClient => {
    const result = await transactionClient.course.create({ data: courseData });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create course');
    }

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      await asyncForEach(
        preRequisiteCourses,
        async (preRequisiteCourses: IPrequisiteCorseRequest) => {
          const createPrerequisite =
            await transactionClient.courseToPrerequisite.create({
              data: {
                courseId: result.id,
                prerequisiteId: preRequisiteCourses.courseId,
              },
            });
          console.log('Createprerequisites', createPrerequisite);
        }
      );
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

      await asyncForEach(
        deletePrerequisite,
        async (deletePreCourse: IPrequisiteCorseRequest) => {
          await transactionClient.courseToPrerequisite.deleteMany({
            where: {
              AND: [
                {
                  courseId: id,
                },
                {
                  prerequisiteId: deletePreCourse.courseId,
                },
              ],
            },
          });
        }
      );

      await asyncForEach(newPrerequisites, async (insertPrequisite:IPrequisiteCorseRequest) => {
        await transactionClient.courseToPrerequisite.create({
          data: {
            courseId: id,
            prerequisiteId: insertPrequisite.courseId,
          },
        });
      });
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
      faculties:{
        include:{
          faculty: true
        }
      }
    },
  });
  return responseData;
};
const getAllFromDB = async (): Promise<Course[]> => {
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

const assignFaculties = async (
  id: string,
  payload:string[]
):Promise <CourseFaculty[]> => {

  console.log(id,payload);
  await prisma.courseFaculty.createMany({
    data: payload.map(facultyId => ({
      courseId: id,
      facultyId: facultyId,
    })),
  });

  const assignFacultiesData = await prisma.courseFaculty.findMany({
    where:{
      courseId:id
    },
    include:{
      faculty:true
    }
  })

  return assignFacultiesData;
}

const removeFaculties = async (id:string,payload:string[]):Promise<CourseFaculty[] | null>=>{

  await prisma.courseFaculty.deleteMany({
    where:{
      courseId:id,
      facultyId:{
        in:payload
      }
    }
  })

  const assignFacultiesData = await prisma.courseFaculty.findMany({
      where: {
        courseId: id,
      },
      include: {
        faculty: true,
      },
    });

    return assignFacultiesData;
}

export const CourseService = {
  insertIntoDB,
  updateOneInDB,
  getById,
  getAllFromDB,
  assignFaculties,
  removeFaculties
};
