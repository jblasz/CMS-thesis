import { appEnv } from '../../appEnv';
import {
  IApiPostResponse, IGetCodesResponse, IPostCodeNewResponse, IPostCodeResponse,
} from '../../interfaces/api';
import { NormalizeCode } from '../../interfaces/code';
import { NormalizeCourseGroupMeta } from '../../interfaces/misc';
import {
  deleteCodeMockResponse, getCodesMockResponse, postCodeMockResponse, postCodeNewMockResponse,
} from '../mocks/in-memory-code-mocks';
import { axiosInstance } from './request.service';

/**
 * /code POST
 */
export async function postCode(studentID: string, code: string): Promise<IPostCodeResponse> {
  if (appEnv().useMocks) {
    return postCodeMockResponse(studentID, code);
  }
  const { data } = await axiosInstance.post('/code', null, {
    headers: {
      code,
    },
  });
  const { ok, type, courseSignup } = data as IPostCodeResponse;
  return { ok, type, courseSignup: NormalizeCourseGroupMeta(courseSignup) };
}

/**
 * /code GET
 */
export async function getCodes(
  inactive = false, courseId?:string, groupId?: string,
): Promise<IGetCodesResponse> {
  if (appEnv().useMocks) {
    return getCodesMockResponse(inactive, courseId);
  }
  const { data } = await axiosInstance.get('/code', {
    params: {
      ...(courseId ? { courseId } : {}),
      ...(groupId ? { groupId } : {}),
      inactive,
    },
  });
  const { codes } = data as IGetCodesResponse;
  return { codes: (codes && codes.length && codes.map((x) => NormalizeCode(x))) || [] };
}

/**
 * /code/:groupId POST
 */
export async function postCodeNew(
  groupId: string, validThrough: Date,
): Promise<IPostCodeNewResponse> {
  if (appEnv().useMocks) {
    return postCodeNewMockResponse(groupId, validThrough);
  }
  const { data } = await axiosInstance.post(`/code/${groupId}`, { validThrough });
  const { code } = data as IPostCodeNewResponse;
  return { code: NormalizeCode(code) };
}

/**
 * /code/:id DELETE
 */

export async function deleteCode(code: string): Promise<IApiPostResponse> {
  if (appEnv().useMocks) {
    return deleteCodeMockResponse(code);
  }
  const { data } = await axiosInstance.delete(`/code/${code}`);
  const { ok } = data as IApiPostResponse;
  return { ok };
}
