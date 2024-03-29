import { AcademicSemester, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { RedisClient } from '../../../shared/redis';
import { AcademicSemesterSearchAbleFields, EVENT_ACADEMIC_SEMESTER_CREATED, EVENT_ACADEMIC_SEMESTER_DELETED, EVENT_ACADEMIC_SEMESTER_UPDATED, academicSemesterTitleCodeMapper } from './academicSemester.constant';
import { IAcademicSemesterFilterRequest } from './academicSemester.interface';


const insertIntoDB = async (
  academicSemesterData: AcademicSemester
): Promise<AcademicSemester> => {
  if (academicSemesterTitleCodeMapper[academicSemesterData?.title] !== academicSemesterData.code) {
    throw new ApiError(400, 'Invalid semester code');
  }
  const result = await prisma.academicSemester.create({ data: academicSemesterData });

  if(result){
    await RedisClient.publish(EVENT_ACADEMIC_SEMESTER_CREATED,JSON.stringify(result));
  }

  return result;
};

const getAllFromDB = async (
  filters: IAcademicSemesterFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<AcademicSemester[]>> => {

  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip ,sortOrder,sortBy } = paginationHelpers.calculatePagination(options);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: AcademicSemesterSearchAbleFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      })),
    });
  }

  if(Object.keys(filterData).length > 0){
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals:(filterData as any )[key]
        }
      }))
    });
  }


  const whereConditions:Prisma.AcademicSemesterWhereInput = andConditions.length > 0 ? {AND:andConditions} :{}
  const result = await prisma.academicSemester.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortBy && sortOrder ?  {
      [sortBy]: sortOrder
    }:{createdAt:'asc'},
  });

  const total = await prisma.academicSemester.count();
  
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<AcademicSemester | null> =>{
   return await prisma.academicSemester.findUnique({where:{id}})
}


const updateOneInDB = async (
  id: string,
  payload: Partial<AcademicSemester>
): Promise<AcademicSemester> => {
  
  const result = await prisma.academicSemester.update({
    where: {
      id,
    },
    data: payload,
  });

  if(result){
    await RedisClient.publish(EVENT_ACADEMIC_SEMESTER_UPDATED,JSON.stringify(result));
  }

  return result;
  
};

const deleteById = async (
  id: string,
): Promise<AcademicSemester> => {
  
  const result = await prisma.academicSemester.delete({
    where:{
      id
    }
  })

  if(result){
    await RedisClient.publish(EVENT_ACADEMIC_SEMESTER_DELETED,JSON.stringify(result));
  }

  return result;
  
};

export const AcademicSemesterService = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateOneInDB,
  deleteById
};
