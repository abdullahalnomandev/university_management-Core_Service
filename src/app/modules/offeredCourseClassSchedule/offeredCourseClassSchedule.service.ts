import { OfferedCourseClassSchedule } from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import { OfferedCourseClassScheduleUtils } from './offeredCourseClasses.utils';

const insertIntoDB = async (
  data: OfferedCourseClassSchedule
): Promise<OfferedCourseClassSchedule> => {

   await OfferedCourseClassScheduleUtils.checkRoomAvailable(data)
  const result = await prisma.offeredCourseClassSchedule.create({
    data,
    include: {
      semesterRegistration: true,
      offeredCourseSection: true,
      room: true,
      facylty: true,
    },
  });

  return result;
};


// const getAllFromDB = async (
//   filters: IOfferedCourseClassScheduleFilterRequest,
//   options: IPaginationOptions
// ): Promise<IGenericResponse<OfferedCourseClassSchedule[]>> => {
//   const { searchTerm, ...filterData } = filters;
//   const { page, limit, skip, sortOrder, sortBy } =
//     paginationHelpers.calculatePagination(options);

//   const andConditions = [];

//   if (searchTerm) {
//     andConditions.push({
//       OR: OfferedCourseClassScheduleSearchableFields.map(field => ({
//         [field]: {
//           contains: searchTerm,
//           mode: 'insensitive',
//         },
//       })),
//     });
//   }

//   if (Object.keys(filterData).length > 0) {
//     andConditions.push({
//       AND: Object.keys(filterData).map(key => ({
//         [key]: {
//           equals: (filterData as any)[key],
//         },
//       })),
//     });
//   }

//   const whereConditions: Prisma.FacultyWhereInput =
//     andConditions.length > 0 ? { AND: andConditions } : {};
//   const result = await prisma.faculty.findMany({
//     where: whereConditions,
//     skip,
//     take: limit,
//     orderBy:
//       sortBy && sortOrder
//         ? {
//             [sortBy]: sortOrder,
//           }
//         : { createdAt: 'asc' },
//     include: {
//       academicDepartment: true,
//       acadeimcFaculty: true,
//       courses: {
//         include: {
//           course: true,
//         },
//       },
//     },
//   });

//   const total = await prisma.faculty.count();

//   return {
//     meta: {
//       total,
//       page,
//       limit,
//     },
//     data: result,
//   };
// };


export const OfferedCourseClassScheduleService = {
  insertIntoDB,
  // getAllFromDB
};
