import { AcademicDepartment, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { RedisClient } from '../../../shared/redis';
import { AcademicDepartmentFilterAbleFields, EVENT_ACADEMIC_DEPARTMENT_CREATED } from './academicFaculty.constant';
import { IAcademicDepartmentFilterRequest } from './academicFaculty.interface';

const insertIntoDB = async (
  data: AcademicDepartment
): Promise<AcademicDepartment> => {
  const result = await prisma.academicDepartment.create({
    data,
    include: {
      academicFaculty: true,
    },
  });

  if(result){
    await RedisClient.publish(EVENT_ACADEMIC_DEPARTMENT_CREATED,JSON.stringify(result));
  }
  return result;
};

const getAllFromDB = async (
  filters: IAcademicDepartmentFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<AcademicDepartment[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortOrder, sortBy } =
    paginationHelpers.calculatePagination(options);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: AcademicDepartmentFilterAbleFields.map(field => ({
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

  const whereConditions: Prisma.AcademicDepartmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.academicDepartment.findMany({
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
      academicFaculty: true,
    },
  });

  const total = await prisma.academicDepartment.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<AcademicDepartment | null> => {
  return await prisma.academicDepartment.findUnique({ where: { id } });
};

export const AcademicDepartmentService = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
};
