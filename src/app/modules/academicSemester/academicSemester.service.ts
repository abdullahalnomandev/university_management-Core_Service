import { AcademicSemester, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { AcademicSemesterSearchAbleFields } from './academicSemester.constant';
import { IAcademicSemesterFilterRequest } from './academicSemester.interface';


const insertIntoDB = async (
  data: AcademicSemester
): Promise<AcademicSemester> => {
  return await prisma.academicSemester.create({ data });
};

const getAllFromDB = async (
  filters: IAcademicSemesterFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<AcademicSemester[]>> => {

  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip ,sortOrder,sortBy } = paginationHelpers.calculatePagination(options);

   console.log('options', options);
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



export const AcademicSemesterService = {
  insertIntoDB,
  getAllFromDB,
  getDataById
};
