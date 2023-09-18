import { SemesterRegistration } from "@prisma/client";
import { prisma } from "../../../shared/prisma";


const insertIntoDb = async (data:SemesterRegistration):Promise<SemesterRegistration> =>{
    return await prisma.semesterRegistration.create({data})
}



export const SemesterRegistrationService ={
    insertIntoDb
}