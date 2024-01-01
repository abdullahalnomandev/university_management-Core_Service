import { ExamType, Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { prisma } from '../../../shared/prisma';
import { StudentEnrolledCourseMarkUtils } from './studentEnrolledCourseMark.utils';

const createStudentEnrolledCourseDefaultMark = async (
  prismaTransactionClient: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >,
  payload: {
    studentId: string;
    studentEnrolledCourseId: string;
    academicSemesterId: string;
  }
) => {
  const isExistMidtermData =
    await prismaTransactionClient.studentEnrolledCourseMark.findFirst({
      where: {
        examType: ExamType.MIDTERN,
        student: {
          id: payload.studentId,
        },
        studentEnrolledCourse: {
          id: payload.studentEnrolledCourseId,
        },
        academicSemester: {
          id: payload.academicSemesterId,
        },
      },
    });
  const isExistFinalData =
    await prismaTransactionClient.studentEnrolledCourseMark.findFirst({
      where: {
        examType: ExamType.FINAL,
        student: {
          id: payload.studentId,
        },
        studentEnrolledCourse: {
          id: payload.studentEnrolledCourseId,
        },
        academicSemester: {
          id: payload.academicSemesterId,
        },
      },
    });

  if (!isExistMidtermData) {
    await prismaTransactionClient.studentEnrolledCourseMark.create({
      data: {
        student: {
          connect: {
            id: payload.studentId,
          },
        },
        studentEnrolledCourse: {
          connect: {
            id: payload.studentEnrolledCourseId,
          },
        },
        academicSemester: {
          connect: {
            id: payload.academicSemesterId,
          },
        },
        examType: ExamType.MIDTERN,
      },
    });
  }

  if(!isExistFinalData){

   await prismaTransactionClient.studentEnrolledCourseMark.create({
     data: {
       student: {
         connect: {
           id: payload.studentId,
         },
       },
       studentEnrolledCourse: {
         connect: {
           id: payload.studentEnrolledCourseId,
         },
       },
       academicSemester: {
         connect: {
           id: payload.academicSemesterId,
         },
       },
       examType: ExamType.FINAL,
     },
   });
  }
      
 
};


const updateStudentMarks = async (payload:any) =>{

  console.log(payload);
   const {studentId,academicSemesterId,courseId,examType,marks} = payload;

   const studentEnrolledCourseMark = await prisma.studentEnrolledCourseMark.findFirst({
    where:{
      student:{
        id:studentId
      },
      academicSemester:{
        id:academicSemesterId
      },
      studentEnrolledCourse:{
        course:{
          id:courseId
        }
      },
      examType
    }
   })

   if(!studentEnrolledCourseMark){
    throw new ApiError(httpStatus.BAD_REQUEST,'Student course marks not found.');
   }

  const {grade} = StudentEnrolledCourseMarkUtils.getGradeFromMarks(marks);
  const updateStudentMarks = await prisma.studentEnrolledCourseMark.update({
    where:{ 
      id:studentEnrolledCourseMark.id
    },
    data:{
      marks,
      grade
    }
  })

  return updateStudentMarks;
}

const updateFinalMarks = async (payload:any) =>{

   console.log(payload);
}
export const StudentEnrolledCourseMarkService = {
  createStudentEnrolledCourseDefaultMark,
  updateStudentMarks,
  updateFinalMarks
};
