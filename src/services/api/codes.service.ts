import { config } from '../../config';
import {
  IApiPostResponse, IGetCodesResponse, IPostCodeNewResponse, IPostCodeResponse,
} from '../../interfaces/api';
import {
  deleteCodeMockResponse, getCodesMockResponse, postCodeMockResponse, postCodeNewMockResponse,
} from '../mocks/in-memory-code-mocks';
import { axiosInstance } from './request.service';

/**
 * /code POST
 */
export async function postCode(code: string): Promise<IPostCodeResponse> {
  if (config.useMocks) {
    return postCodeMockResponse(code);
  }
  const { data } = await axiosInstance.post('/code', null, {
    headers: {
      code,
    },
  });
  const { ok, type, courseSignup } = data as IPostCodeResponse;
  return { ok, type, courseSignup };
}

/**
 * /code GET
 */
export async function getCodes(grabInactive = false, courseId?:string): Promise<IGetCodesResponse> {
  if (config.useMocks) {
    return getCodesMockResponse(grabInactive, courseId);
  }
  const { data } = await axiosInstance.get('/code', {
    params: {
      ...(courseId ? { courseId } : {}),
    },
  });
  const { codes } = data as IGetCodesResponse;
  return { codes };
}

/**
 * /code/:courseId POST
 */
export async function postCodeNew(
  courseId: string, validThrough: Date,
): Promise<IPostCodeNewResponse> {
  if (config.useMocks) {
    return postCodeNewMockResponse(courseId, validThrough);
  }
  const { data } = await axiosInstance.post(`/code/${courseId}`, { validThrough });
  const { code } = data as IPostCodeNewResponse;
  return { code };
}

/**
 * /code/:id DELETE
 */

export async function deleteCode(code: string): Promise<IApiPostResponse> {
  if (config.useMocks) {
    return deleteCodeMockResponse(code);
  }
  const { data } = await axiosInstance.delete(`/code/${code}`);
  const { ok } = data as IApiPostResponse;
  return { ok };
}
