import { OfferedCourseClassSchedule } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { prisma } from "../../../shared/prisma";
import { hasTimeConflict } from "../../../shared/utils";

 const checkRoomAvailable = async (data:OfferedCourseClassSchedule) =>{
  const alreadyBookRoomOnDay = await prisma.offeredCourseClassSchedule.findMany({
      where: {
        dayOfWeek: data.dayOfWeek,
        room: {
          id: data.roomId,
        },
      },
    });

  // existing: 12:00 -13:00
  // new slot: 12:50-13:50
  const existingSlots = alreadyBookRoomOnDay.map(schedule => ({
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    dayOfWeek: schedule.dayOfWeek,
  }));

  const newSlot = {
    startTime: data.startTime,
    endTime: data.endTime,
    dayOfWeek: data.dayOfWeek,
  };

  if (hasTimeConflict(existingSlots, newSlot)) {
    throw new ApiError(httpStatus.CONFLICT, 'Room is already booked');
  }
}

export const OfferedCourseClassScheduleUtils = {
    checkRoomAvailable
}