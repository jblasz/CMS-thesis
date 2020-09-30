import { Resource } from '../../interfaces/resource';
import { getResourceMockResponse, putResourceMockResponse } from '../mocks/in-memory-resource-mocks';

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
