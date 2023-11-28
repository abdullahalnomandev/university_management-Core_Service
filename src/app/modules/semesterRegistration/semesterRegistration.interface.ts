export type ISemesterRegistrationFilterRequest = {
  searchTerm?: string | undefined;
  academicSemesterId?: string | undefined;
};

export type IEnrollCoursePayload = {
  offerCourseId: string;
  offerCourseSectionId: string;
};