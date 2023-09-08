import { Prisma, Student } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { studentSearchableFields } from './student.constant';
import { IStudentFilterRequest } from './student.interface';


const insertIntoDB = async (data: Student): Promise<Student> => {
  return await prisma.student.create({ data,
 include:{
    academicSemester:true,
    academicFaculty:true,
    acadeicDepartment:true
  }
  },);
};

const getAllFromDB = async (
  filters: IStudentFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Student[]>> => {

  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip ,sortOrder,sortBy } = paginationHelpers.calculatePagination(options);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: studentSearchableFields.map(field => ({
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


  const whereConditions:Prisma.StudentWhereInput = andConditions.length > 0 ? {AND:andConditions} :{}
  const result = await prisma.student.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortBy && sortOrder ?  {
      [sortBy]: sortOrder
    }:{createdAt:'asc'},
    include:{
      acadeicDepartment:true,
      academicFaculty:true,
      academicSemester:true
    }
  });

  const total = await prisma.student.count();
  
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<Student | null> =>{
   return await prisma.student.findUnique({where:{id}})
}



export const StudentService = {
  insertIntoDB,
  getAllFromDB,
  getDataById
};
