import { GetResourcesResponse } from '../../interfaces/api';
import { Permission, Resource } from '../../interfaces/resource';
import { getResourcesMockResponse } from '../mocks';
import {
  deleteResourceMockResponse,
  getResourceMockResponse,
  patchResourceMockResponse,
  putResourceMockResponse,
} from '../mocks/in-memory-resource-mocks';

/**
 * /resource/:id GET
 */
export async function getResource(_id: string) {
  return getResourceMockResponse(_id);
}

/**
 * /resource/:id PUT
 */
export async function putResource(resource: Resource) {
  return putResourceMockResponse(resource);
}

/**
 * /resource GET
 */
export async function getResources(): Promise<GetResourcesResponse> {
  return getResourcesMockResponse();
}

/**
 * /resource/:id PATCH
 */
export async function patchResource(_id: string, name: string, permission: Permission) {
  return patchResourceMockResponse(_id, name, permission);
}

/**
 * /resource/:id DELETE
 */
export async function deleteResource(_id: string) {
  return deleteResourceMockResponse(_id);
}
