import { CourseFaculty, Faculty, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { facultySearchableFields } from './faculty.constant';
import { FacultyCreatedEvent, IFacultyFilterRequest } from './faculty.interface';

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

const myCourses = async (authUser:{
  userId:string,
  role:string
},filter:{
  academicSemesterId?: string |null|undefined,
  courseId?: string |null|undefined,
}) =>{

  if(!filter.academicSemesterId){
    const currentSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });
    filter.academicSemesterId =currentSemester?.id;
  }

  
  const offeredCourseSections = await prisma.offeredCourseSection.findMany({
    where: {
      offeredCourseClassSchedules: {
        some: {
          facylty:{
            id:authUser.userId
          }
        },
      },
      offeredCourse:{
        semesterRegistration:{
          academicSemester:{
            id:filter.academicSemesterId
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
      offeredCourseClassSchedules:{
        include:{
          room:{
            include:{
              building:true
            }
          }
        }
      }
    }
  });
  
  
  const courseAndSchedule = offeredCourseSections.reduce((acc:any,obj:any) =>{

    const course = obj.offeredCourse.course;
    const classSchedules = obj.offeredCourseClassSchedules;
    const existingCOurse = acc.find((item:any) => item?.course?.id === course?.id);

    if(existingCOurse){
      existingCOurse.sections.push({
        section:obj,
        classSchedules
      })
    }
    else{
      acc.push({
        course,
        sections:[
          {
            section:obj,
            classSchedules
          }
        ]
      })
    }

    return acc;
  },[]) 

  return courseAndSchedule;
}

const createFacultyFromEvent = async (
  e: FacultyCreatedEvent
): Promise<void> => {
  const faculty: Partial<Faculty> = {
    facultyId: e.id,
    firstName: e.name.firstName,
    lastName: e.name.lastName,
    middleName: e.name.middleName,
    profileImage: e.profileImage || "",
    email: e.email,
    contactNo: e.contactNo,
    gender: e.gender,
    bloodGroup: e.bloodGroup,
    designation: e.designation,
    academicDepartmentId: e.academicDepartment.syncId,
    academicFacultyId: e.academicFaculty.syncId,
  };

  const data = await insertIntoDB(faculty as Faculty);
  console.log('RES: ', data);
};


const updateFacultyFromEvent = async (e:any):Promise<void>=>{
  const isExist = await prisma.faculty.findFirst({
    where:{
      facultyId:e.id
    }
  })

  if(!isExist) {
    createFacultyFromEvent(e);
  }else{

    const facultyData: Partial<Faculty> = {
      facultyId: e.id,
      firstName: e.firstName,
      lastName: e.lastName,
      middleName: e.middleName,
      email: e.email,
      contactNo: e.contactNo,
      gender: e.gender,
      bloodGroup: e.bloodGroup,
      designation: e.designation,
      academicDepartmentId: e.academicDepartmentId.syncId,
      academicFacultyId: e.academicFaculty.syncId,
      profileImage: e.profileImage || '',
    };

    const res = await prisma.faculty.updateMany({
      where:{
        facultyId:e.id
      },
      data:facultyData
    })

    console.log('res',res);
  }


}
export const FacultyService = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  assignCourses,
  removeCourses,
  myCourses,
  createFacultyFromEvent,
  updateFacultyFromEvent
};
