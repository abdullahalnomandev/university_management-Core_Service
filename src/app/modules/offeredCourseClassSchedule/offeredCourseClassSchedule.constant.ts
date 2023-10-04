export const OfferedCourseClassScheduleSearchableFields = ['dayOfWeek'];
export const offeredCourseClassScheduleRelationalFields = [
  'offeredCourseSectionId',
  'semesterRegistrationid',
  'facultyId',
  'roomId',
];

export const offeredCourseClassScheduleRelationalFieldsMapper:{[key:string]:string} = {
    offeredCourseSectionId:'offeredCourseSection',
    semesterRegistrationid:"semesterRegistration",
    facultyId:"facylty",
    roomId:"room",

}

export const offeredCourseClassScheduleFilterableFields = [
    'searchTerm',
    'dayOfWeek',
    'offeredCourseSectionId',
    'semesterRegistrationId',
    'roomId',
    'facultyId'
]