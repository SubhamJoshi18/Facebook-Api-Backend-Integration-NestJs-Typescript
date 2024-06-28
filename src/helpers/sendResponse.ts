import { HttpException } from '@nestjs/common';
import { Response } from 'express';
import { IResponseObject } from 'src/auth/types/interface';

enum statusConstant {
  GOOD = 'GOOD',
  BAD = 'BAD',
}

export const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data = null,
) => {
  const responseObject: IResponseObject = {
    statusCode,
    message,
    status: `${statusCode}`.toString().startsWith('2')
      ? statusConstant.GOOD
      : statusConstant.BAD,
  };
  if (data !== null || data) {
    responseObject.data = data;
  }

  // for (const [key, value] of Object.entries(responseObject)) {
  //   console.log(key, value);
  //   if (key || value === null)
  //     throw new HttpException('Invalid Error Resposnse', 401);
  // }

  return res.status(statusCode).json(responseObject);
};
