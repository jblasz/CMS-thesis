import { GetResourcesResponse } from '../../interfaces/api';
import { Resource } from '../../interfaces/resource';
import { getResourcesMockResponse } from '../mocks';
import {
  deleteResourceMockResponse,
  getResourceMockResponse,
  putResourceMockResponse,
  putResourceNameMockResponse,
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
export async function patchResourceName(_id: string, name: string) {
  return putResourceNameMockResponse(_id, name);
}

/**
 * /resource/:id DELETE
 */
export async function deleteResource(_id: string) {
  return deleteResourceMockResponse(_id);
}
