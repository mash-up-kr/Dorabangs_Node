// import { Injectable, NotFoundException } from '@nestjs/common';
// import { FolderType } from '@prisma/client';
// import { PrismaService } from '../prisma/prisma.service';
// import { F002 } from './error';

// // TODO: Service class name will be changed after the naming convention is discussed later.
// @Injectable()
// export class FoldersPGRepository {
//   constructor(private readonly prisma: PrismaService) {}

//   async create(userId: string, name: string, type: FolderType) {
//     const folder = await this.prisma.folder.create({
//       data: {
//         userId,
//         name,
//         type,
//       },
//     });

//     return folder;
//   }

//   async createMany(
//     folders: { userId: string; name: string; type: FolderType }[],
//   ) {
//     const createdFolders = await this.prisma.folder.createMany({
//       data: folders,
//     });
//     return createdFolders;
//   }

//   async findByUserId(userId: string) {
//     const folders = await this.prisma.folder.findMany({
//       where: { userId },
//     });
//     return folders;
//   }

//   async checkUserHasFolder(userId: string, name: string) {
//     const checkFolder = await this.prisma.folder.findFirst({
//       where: {
//         userId: userId,
//         name: name,
//       },
//     });
//     return checkFolder ? true : false;
//   }

//   async findOneOrFail(param: { userId: string; name: string }) {
//     const folder = await this.prisma.folder.findFirst({
//       where: param,
//     });
//     if (!folder) {
//       throw new NotFoundException(F002);
//     }

//     return folder;
//   }

//   async deleteAllCustomFolder(userId: string) {
//     await this.prisma.folder.deleteMany({
//       where: {
//         userId,
//         type: FolderType.custom,
//       },
//     });
//   }

//   async getDefaultFolder(userId: string) {
//     const folder = await this.prisma.folder.findFirst({
//       where: {
//         userId,
//         type: FolderType.default,
//       },
//     });

//     return folder;
//   }
// }
