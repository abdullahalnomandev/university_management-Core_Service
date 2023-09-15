export type ICourseCreateData = {
  title: string;
  code: string;
  credits: number;
  preRequisiteCourses: IPrequisiteCorseRequest[];
};

export type IPrequisiteCorseRequest = {
  courseId: string;
  isDeleted?: null;
};