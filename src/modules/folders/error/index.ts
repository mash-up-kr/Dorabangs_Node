import { createErrorObject } from '@src/common';

export const F001 = (folderName: string) => {
  return createErrorObject(
    'F001',
    `폴더 이름이 중복되었습니다 - ${folderName}`,
  );
};

export const F002 = createErrorObject('F002', '폴더가 존재하지 않습니다!');