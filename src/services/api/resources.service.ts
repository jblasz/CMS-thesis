import { config } from '../../config';
import {
  IApiPostResponse,
  IGetResourcesResponse,
  IPatchResourceResponse,
  IPutResourceResponse,
} from '../../interfaces/api';
import { Permission } from '../../interfaces/resource';
import { getResourcesMockResponse } from '../mocks';
import {
  deleteResourceMockResponse,
  patchResourceMockResponse,
  putResourceMockResponse,
} from '../mocks/in-memory-resource-mocks';
import { axiosInstance } from './request.service';

/**
 * /resource GET
 */
export async function getAdminResources(): Promise<IGetResourcesResponse> {
  if (config.useMocks) {
    return getResourcesMockResponse();
  }
  const { data } = await axiosInstance.get('/resource');
  const { resources } = data as IGetResourcesResponse;
  return { resources };
}

/**
 * /resource/:id GET
 */
export async function getAdminResource(_id: string) {
  const a = document.createElement('a');
  a.target = '_blank';
  a.href = `${axiosInstance.defaults.baseURL}/resource/${_id}`;
  a.click();
  return Promise.resolve({});

  // if (config.useMocks) {
  //   return getResourceMockResponse(_id);
  // }
  // const { data } = await axiosInstance.get(`/resource${_id}`);
  // const { resource } = data as IGetResourceResponse;
  // return { resource };
}

/**
 * /resource/:id PUT
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function putAdminResource(
  id: string, file: FormData,
): Promise<IPutResourceResponse> {
  if (config.useMocks) {
    return putResourceMockResponse(id);
  }

  const { data } = await axiosInstance.put(`/resource/${id}`, file);
  const { ok, resource } = data as IPutResourceResponse;
  return { ok, resource };
}

/**
 * /resource/:id PATCH
 */
export async function patchAdminResource(
  _id: string, name: string, permission: Permission,
): Promise<IPatchResourceResponse> {
  if (config.useMocks) {
    return patchResourceMockResponse(_id, name, permission);
  }
  const { data } = await axiosInstance.patch(`/resource/${_id}`, {
    name,
    permission,
  });
  const { ok, resource } = data as IPatchResourceResponse;
  return { ok, resource };
}

/**
 * /resource/:id DELETE
 */
export async function deleteAdminResource(_id: string): Promise<IApiPostResponse> {
  if (config.useMocks) {
    return deleteResourceMockResponse(_id);
  }
  const { data } = await axiosInstance.delete(`/resource/${_id}`);
  const { ok } = data as IApiPostResponse;
  return { ok };
}
