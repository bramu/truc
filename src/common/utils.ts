'use strict';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import * as uuid from 'uuid';
import { decode, encode } from 'base-64';
import { Md5 } from 'ts-md5/dist/md5';
export class TruUtil {
  static md5: any = Md5;
  static log = (x: any, y?: any) => {
    if (process.env.CONSOLE_LOG == 'true') {
      if (x != undefined && y == undefined) console.log(x);
      else if (x != undefined && y != undefined) console.log(x, y);
      else console.log('No parameters received.');
    }
  };
  static md5HashStr = (data: string): string => {
    if (!data) return data;
    else return TruUtil.md5.hashStr(data);
  };
  static extension = (x: string): string => {
    if (!x) return '';
    const arr: string[] = x.trim().split('.');
    return arr.length === 1 ? '' : arr[arr.length - 1];
  };
  static getRandomNumberBetween = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  static decode = (x: string): string => {
    return decode(x);
  };
  static encode = (x: string): string => {
    return encode(x);
  };
  static error = (x: any, y?: any) => {
    if (process.env.CONSOLE_ERROR! == 'true') {
      if (x != undefined && y == undefined) console.error(x);
      else if (x != undefined && y != undefined) console.error(x, y);
      else console.error('No parameters received.');
    }
  };
  static validEmail = (emails: string[]) => {
    if (
      emails == undefined ||
      emails == null ||
      (Array.isArray(emails) && emails.length == 0)
    )
      return false;
    const emailRegexp =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    let flag = true;
    if (!Array.isArray(emails)) emails = [emails];
    for (const x of emails) {
      if (!emailRegexp.test(x)) {
        return (flag = false);
      }
    }
    return flag;
  };
  static hasData = (data: string) => {
    return !TruUtil.blank(data);
  };
  static blank = (data: string) => {
    return data == undefined || data == null || data.trim() === '';
  };
  static hasDataForAll = (...data: string[]) => {
    for (const x of data) {
      if (TruUtil.blank(x)) return false;
    }
    return true;
  };
  static dataBlankForAll = (...data: string[]) => {
    for (const x of data) {
      if (TruUtil.hasData(x)) return false;
    }
    return true;
  };
  static dataBlankForAny = (...data: string[]) => {
    for (const x of data) {
      if (TruUtil.blank(x)) return true;
    }
    return false;
  };
  static hasDataForAny = (...data: string[]) => {
    for (const x of data) {
      if (TruUtil.hasData(x)) return true;
    }
    return false;
  };
  static generateRandomString = () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('randomstring').generate({
      length: 6,
      charset: 'alphanumeric',
    });
  };
  static getJwt = (data: any) => {
    return jwt.sign(
      {
        data: data,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '30 days' },
    );
  };
  static letifyJwt = (
    token: string,
    secret?: string,
  ): { success: boolean; data?: any; message?: string } => {
    if (!secret) secret = process.env.JWT_SECRET;
    try {
      const _o: any = jwt.verify(token, secret!);
      return { success: true, data: _o.data };
    } catch (err) {
      // log(err);
      return { success: false, message: 'Invalid token.' };
    }
  };
  static getHash = (data: string, key?: string) => {
    if (key == undefined) key = process.env.PWD_HASH_SALT!;
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(data);
    return hmac.digest('hex');
  };
  static makeQueryPramVal = (val: string): string | null => {
    if (val === null) return null;
    else return val.replace("'", "\\'");
  };

  static generateSalt = () => {
    // Generate a v1 (time-based) id
    return uuid.v1(); // -> '6c84fb90-12c4-11e1-840d-7b25c5ee775a'
    // Generate a v4 (random) id
    // return require('uuid').v4(); // -> '110ec58a-a0f2-4ac4-8393-c866d813b8d1'
  };
  static uuidV1 = uuid.v1;
  // static uuidV3 = uuid.v3;
  static uuidV4 = uuid.v4;
  // static uuidV5 = uuid.v5;
}
