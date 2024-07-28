// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';

// // TODO: Service class name will be changed after the naming convention is discussed later.
// @Injectable()
// export class UsersPGRepository {
//   constructor(private readonly prisma: PrismaService) {}
//   private defaultFolderName = '나중에 읽을 링크';

//   async findOrCreate(deviceToken: string) {
//     const user = await this.prisma.user.upsert({
//       where: {
//         deviceToken: deviceToken,
//       },
//       create: {
//         deviceToken: deviceToken,
//         folders: {
//           create: [
//             {
//               name: this.defaultFolderName,
//               type: 'default',
//             },
//           ],
//         },
//       },
//       update: {},
//     });
//     return user;
//   }
// }
