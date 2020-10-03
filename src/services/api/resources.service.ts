import { GetResourcesResponse } from '../../interfaces/api';
import { Resource } from '../../interfaces/resource';
import { getResourceMockResponse, getResourcesMockResponse, putResourceMockResponse } from '../mocks/in-memory-resource-mocks';

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
