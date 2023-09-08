import { Building, Prisma } from "@prisma/client";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { prisma } from "../../../shared/prisma";
import { BuildingSearchableFields } from "./building.constant";
import { IBuildingFilterRequest } from "./building.interface";

const insertIntoDB = async (data: Building): Promise<Building> => {
  return await prisma.building.create({ data });
};

const getAllFromDB = async (
    filters:IBuildingFilterRequest,
    options:IPaginationOptions
):Promise<IGenericResponse<Building[]>> =>{
    
  const { searchTerm } = filters;
  const { page, limit, skip ,sortOrder,sortBy } = paginationHelpers.calculatePagination(options);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: BuildingSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
    const whereConditions:Prisma.BuildingWhereInput = andConditions.length > 0 ? {AND:andConditions} :{}
    const result =await prisma.building.findMany({
        skip,
        take: limit,
        where:whereConditions,
            orderBy: sortBy && sortOrder ?  {
      [sortBy]: sortOrder
    }:{createdAt:'asc'},
    })

    const total =await prisma.building.count({ where:whereConditions})
    return {
        meta:{
            page,
            limit,
            total
        },
        data:result
    };
}

export const BuildingService ={
    insertIntoDB,
    getAllFromDB
}