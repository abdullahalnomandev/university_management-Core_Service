import { z } from 'zod';
import { academicSemesterCodes, academicSemesterMonths, academicSemesterTitles } from './academicSemester.constant';


const create = z.object({
  body: z.object({
    year: z.number({
      required_error: 'Year is required',
    }),
    title: z.enum([...academicSemesterTitles] as [string], {
      required_error: 'Title is required',
    }),
    code: z.enum([...academicSemesterCodes] as [string], {
      required_error: 'Code is required',
    }),
    startMonth: z.enum([...academicSemesterMonths] as [string], {
      required_error: 'Start month is required',
    }),
    endMonth: z.enum([...academicSemesterMonths] as [string], {
      required_error: 'End month is required',
    }),
  }),
});

export const AcademicSemesterValidation = {
  create,
};
