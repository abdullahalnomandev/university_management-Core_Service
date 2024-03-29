import { Prisma, Student, StudentEnrolledCourseStatus } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { studentSearchableFields } from './student.constant';
import { IStudentFilterRequest } from './student.interface';
import { StudentUtils } from './student.utils';


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


const updateIntoDB = async (id:string,payload:Partial<Student>):Promise <Student> =>{
  const result = await prisma.student.update({
    where:{
      id
    },
    data:payload
  })
  return result;
}
const deleteFromDB = async (id:string):Promise <Student> =>{
  const result = await prisma.student.delete({
    where:{
      id
    },
    include:{
      acadeicDepartment:true,
      academicSemester:true,
      academicFaculty:true,
    }
  })
  return result;
}

const myCourses = async (
  authUserId: string,
  filter: {
    courseId?: string | undefined,
    academicSemesterId?:string | undefined;
  }
) => {
   
  if(!filter.academicSemesterId){
    const currentSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });
    filter.academicSemesterId= currentSemester?.id;
  }
  const result = await prisma.studentEnrolledCourse.findMany({
    where: {
      student: {
        studentId: authUserId,
      },
      ...filter
    },
    include:{
      course:true
    }
  });

  return result;
};


const getMyCourseSchedules = async (
  authUserId: string,
  filter: {
    courseId?: string | undefined;
    academicSemesterId?: string | undefined;
  }
) => {
    if (!filter.academicSemesterId) {
      const currentSemester = await prisma.academicSemester.findFirst({
        where: {
          isCurrent: true,
        },
      });
      filter.academicSemesterId = currentSemester?.id;
    }

    const studentEnrolledCourses = await myCourses(authUserId,filter);
    const studentEnrolledCourseIds = studentEnrolledCourses.map((item) => item.courseId);
    const result = await prisma.studentSemesterRegistrationCourse.findMany({
      where:{
        student:{
          studentId:authUserId
        },
        semesterRegistration:{
          academicSemester:{
            id:filter.academicSemesterId
          }
        },
        offeredCourse:{
          course:{
            id:{
              in:studentEnrolledCourseIds
            }
          }
        }
      },
      include:{
        offeredCourse:{
          include:{
            course:true
          }
        },
        offerCourseSection:{
          include:{
            offeredCourseClassSchedules:{
              include:{
                room:{
                  include:{
                    building:true
                  }
                },
                facylty:true
              }
            }
          }
        }
      }
    })
    return result;
};

const getMyAcademicInfo = async (authUserId:string):Promise<any> =>{

  console.log('authentication',authUserId);
  const academicInfo = await prisma.studentAcademicInfo.findFirst({
    where:{
      student:{
        studentId:authUserId,
      }
    }
  });

  const enrolledCourses = await prisma.studentEnrolledCourse.findMany({
    where:{
      student:{
        studentId:authUserId
      },
      status:StudentEnrolledCourseStatus.COMPLETED
    },
    include:{
      course:true,
      academicSemester:true
    },
    orderBy:{
      createdAt:'asc'
    }
  })

 const groupByAcademicSemesterData = StudentUtils.groupByAcademicSemester(enrolledCourses)
 return {
  academicInfo,
  courses:groupByAcademicSemesterData
 }
}

const createStudentFromEvent = async (e:any):Promise<void> =>{
  const studentData:Partial<Student> = {
    studentId:e.id,
    firstName:e.name.firstName,
    middleName:e.name.middleName,
    lastName:e.name.lastName,
    email:e.email,
    contactNo:e.contactNo,
    gender:e.gender,
    bloodGroup:e.bloodGroup,
    academicFacultyId:e.academicFaculty.syncId,
    academicDepartmentId:e.academicDepartment.syncId,
    academicSemesterId:e.academicSemester.syncId
  }

  await insertIntoDB(studentData as Student)
}
export const StudentService = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteFromDB,
  myCourses,
  getMyCourseSchedules,
  getMyAcademicInfo,
  createStudentFromEvent
};
