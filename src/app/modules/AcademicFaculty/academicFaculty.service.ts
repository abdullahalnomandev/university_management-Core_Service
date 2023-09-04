import { AcademicFaculty, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { AcademicFacultyFilterAbleFields } from './academicFaculty.constant';
import { IAcademicFacultyFilterRequest } from './academicFaculty.interface';

const insertIntoDB = async (
  data: AcademicFaculty
): Promise<AcademicFaculty> => {
  return await prisma.academicFaculty.create({ data });
};

const getAllFromDB = async (
  filters:  IAcademicFacultyFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<AcademicFaculty[]>> => {

  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip ,sortOrder,sortBy } = paginationHelpers.calculatePagination(options);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: AcademicFacultyFilterAbleFields.map(field => ({
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


  const whereConditions:Prisma.AcademicFacultyWhereInput = andConditions.length > 0 ? {AND:andConditions} :{}
  const result = await prisma.academicFaculty.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortBy && sortOrder ?  {
      [sortBy]: sortOrder
    }:{createdAt:'asc'},
  });

  const total = await prisma.academicFaculty.count();
  
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<AcademicFaculty | null> =>{
   return await prisma.academicFaculty.findUnique({where:{id}})
}



export const AcademicFacultyService = {
  insertIntoDB,
  getAllFromDB,
  getDataById
};
