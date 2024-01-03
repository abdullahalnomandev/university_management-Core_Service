import { ExamType, Prisma, PrismaClient, StudentEnrolledCourseStatus } from '@prisma/client';
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

  if (!isExistFinalData) {
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

const updateStudentMarks = async (payload: any) => {
  const { studentId, academicSemesterId, courseId, examType, marks } = payload;

  const studentEnrolledCourseMark =
    await prisma.studentEnrolledCourseMark.findFirst({
      where: {
        student: {
          id: studentId,
        },
        academicSemester: {
          id: academicSemesterId,
        },
        studentEnrolledCourse: {
          course: {
            id: courseId,
          },
        },
        examType,
      },
    });

  if (!studentEnrolledCourseMark) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Student course marks not found.'
    );
  }

  const { grade } = StudentEnrolledCourseMarkUtils.getGradeFromMarks(marks);
  const updateStudentMarks = await prisma.studentEnrolledCourseMark.update({
    where: {
      id: studentEnrolledCourseMark.id,
    },
    data: {
      marks,
      grade,
    },
  });

  return updateStudentMarks;
};

const updateFinalMarks = async (payload: any) => {
  const { studentId, academicSemesterId, courseId } = payload;
  const studentEnrolledCourse = await prisma.studentEnrolledCourse.findFirst({
    where: {
      student: {
        id: studentId,
      },
      academicSemester: {
        id: academicSemesterId,
      },
      course: {
        id: courseId,
      },
    },
  });

  if (!studentEnrolledCourse) {
    throw new ApiError(httpStatus.BAD_REQUEST,'Student enrolled course data not found');
  }

  const studentEnrolledCourseMarks = await prisma.studentEnrolledCourseMark.findMany({
    where: {
      student: {
        id: studentId,
      },
      academicSemester: {
        id: academicSemesterId,
      },
      studentEnrolledCourse: {
        course: {
          id: courseId,
        },
      },
    },
  });

  if (!studentEnrolledCourseMarks.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Student enrolled course mark not found'
    );
  }

  const midTermMarks = studentEnrolledCourseMarks.find( ({ examType }) => examType === ExamType.MIDTERN )?.marks || 0;
  const finalmMarks = studentEnrolledCourseMarks.find( ({ examType }) => examType === ExamType.FINAL)?.marks ||0;

  const totalFinalMarks = Math.ceil(midTermMarks * 0.4) +  Math.ceil(finalmMarks * 0.6);
  const result = StudentEnrolledCourseMarkUtils.getGradeFromMarks(totalFinalMarks);

  await prisma.studentEnrolledCourse.updateMany({
    where: {
      student: {
        id: studentId,
      },
      academicSemester: {
        id: academicSemesterId,
      },
      course: {
        id: courseId,
      },
    },
    data:{
      grade:result.grade,
      point:result.point,
      totalMark:totalFinalMarks,
      status:StudentEnrolledCourseStatus.COMPLETED
    }
  });

  const grades = await prisma.studentEnrolledCourse.findMany({
    where:{
      student:{
        id:studentId
      },
      status:StudentEnrolledCourseStatus.COMPLETED
    },
    include:{
      course:true
    }
  })

 const academicResult = await StudentEnrolledCourseMarkUtils.calcCGPAandGrade(grades);

 const studentAcademciInfo = await prisma.studentAcademicInfo.findFirst({
  where:{
    student:{
      id:studentId
    }
  }
 })

 if(studentAcademciInfo){ 
  await prisma.studentAcademicInfo.update({
    where:{
      id:studentAcademciInfo.id
    },
   data: {
     student: {
       connect: {
         id: studentId,
       },
     },
     totalCompletedCredit: academicResult.totalCompletedCredit,
     cgpa: academicResult.cgpa,
   },
 });
  
 }else{
   await prisma.studentAcademicInfo.create({
     data: {
       student: {
         connect: {
           id: studentId,
         },
       },
       totalCompletedCredit: academicResult.totalCompletedCredit,
       cgpa: academicResult.cgpa,
     },
   });
 }

 return grades
  
};
export const StudentEnrolledCourseMarkService = {
  createStudentEnrolledCourseDefaultMark,
  updateStudentMarks,
  updateFinalMarks,
};
