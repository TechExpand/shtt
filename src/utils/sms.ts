import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import express from "express";
import { isEqual } from "lodash";
import { Resend } from 'resend';

//function to generate random number
export const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
}

export const makeid = (length: number) => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}



export const removeDuplicateObjects = (inputArray: any) => {
  const uniqueArray = [];

  inputArray.forEach((item) => {
    // Check if the item already exists in the uniqueArray
    if (!uniqueArray.some((obj) => isEqual(obj, item))) {
      uniqueArray.push(item);
    }
  });

  return uniqueArray;
}



export const ResDec = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const response = ctx.switchToHttp().getResponse();
    return response;
  },
);



export function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function uniqueRandomNumberInRange(min: number, max: number, existingList: number[]) {
  if (existingList.length === (max - min + 1)) {
    console.log('The list already contains all possible numbers in the range.');
    return 0;
  }

  let randomNumber: number;
  do {
    randomNumber = getRandomNumber(min, max);
  } while (existingList.includes(randomNumber));

  return randomNumber;
}



export function getRole(role: number): string {
  if (role == 1) {
    return "USER"
  } else if (role == 2) {
    return "DRIVER"
  } else if (role == 3) {
    return "ADMIN"
  } else {
    return "OPERATOR"
  }
}


const resend = new Resend(process.env.RESEND);
export const sendEmailResend = async (email: String, subject: String, template: String) => {
  resend.emails.send({
    from: 'app@foodtruck.express',
    to: `${email}`,
    subject: `${subject}`,
    html: `${template}`
  });
}
