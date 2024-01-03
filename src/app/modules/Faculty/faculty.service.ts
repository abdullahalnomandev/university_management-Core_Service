import { CourseFaculty, Faculty, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { facultySearchableFields } from './faculty.constant';
import { IFacultyFilterRequest } from './faculty.interface';

const insertIntoDB = async (data: Faculty): Promise<Faculty> => {
  return await prisma.faculty.create({
    data,
    include: {
      acadeimcFaculty: true,
      academicDepartment: true
    },
  });
};

const getAllFromDB = async (
  filters: IFacultyFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Faculty[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortOrder, sortBy } =
    paginationHelpers.calculatePagination(options);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: facultySearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.FacultyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.faculty.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: 'asc' },
    include: {
      academicDepartment: true,
      acadeimcFaculty: true,
      courses: {
        include:{
          course:true
        }
      },
    },
  });

  const total = await prisma.faculty.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<Faculty | null> => {
  return await prisma.faculty.findUnique({ where: { id } });
};


const assignCourses= async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.createMany({
    data: payload.map(courseId => ({
      facultyId: id,
      courseId: courseId,
    })),
  });

  const assignCoursesData = await prisma.courseFaculty.findMany({
    where: {
      facultyId: id,
    },
    include:{
      course:true
    }
  });

  return assignCoursesData;
};

const removeCourses= async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[] | null> => {
  await prisma.courseFaculty.deleteMany({
    where: {
      facultyId: id,
      courseId: {
        in: payload,
      },
    },
  });

  const assignFacultiesData = await prisma.courseFaculty.findMany({
    where: {
      facultyId: id,
    },
    include: {
      course: true,
    },
  });

  return assignFacultiesData;
};


export const FacultyService = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  assignCourses,
  removeCourses
};
