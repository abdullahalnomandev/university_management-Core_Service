const getAvailableCourses = (
  offeredCourse: any,
  studentCompletedCourse: any,
  studentCurrentlyTakenCourse: any
) => {
  const completedCOurseId = studentCompletedCourse.map(
    ({ courseId }: any) => courseId
  );
  const availableCoursesList = offeredCourse
    .filter(({ courseId }: any) => !completedCOurseId.includes(courseId))
    .filter((course: any) => {
      const preRequisites = course.course.preRequisite;

      if (preRequisites.length === 0) {
        return true;
      } else {
        const preRequisiteIds = preRequisites.map(
          (preRequisite: any) => preRequisite.preRequisiteId
        );
        return preRequisiteIds.every((id: string) =>
          completedCOurseId.includes(id)
        );
      }
    })
    .map((course: any) => {
      const isAlreadyTakenCourse = studentCurrentlyTakenCourse.find(
        (c: any) => c.offeredCourseId === course.id
      );

      if (isAlreadyTakenCourse) {
        course.offeredCourseSections.map((section: any) => {
          if (section.id === isAlreadyTakenCourse.offeredCourseSectionId) {
            section.isTaken = true;
          } else {
            section.isTaken = false;
          }
        });
        return {
          ...course,
          isTaken: true,
        };
      }
      else {
        course.offeredCourseSection.map((section:any) =>{
            section.isTaken = false;
        })
        return {
            ...course,
            isTaken: false,
        }
      }
    });

  return availableCoursesList;
};

export const SemesterRegistrationUtils = {
  getAvailableCourses,
};
