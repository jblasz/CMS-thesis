import { v4 } from 'uuid';
import { Resource, Submission } from '../../interfaces/resource';

const inMemoryResourceMocks: Resource[] = [];

const inMemorySubmissionMocks: Submission[] = [];

export async function getResourceMockResponse(id: string) {
  const f = inMemoryResourceMocks.find((x) => x._id === id);
  if (f) {
    return Promise.resolve(f);
  }
  return Promise.reject();
}

export async function putResourceMockResponse(resource: Resource) {
  if (resource._id) {
    const f = inMemoryResourceMocks.findIndex((x) => x._id === resource._id);
    if (f > -1) {
      inMemoryResourceMocks[f] = resource;
      return Promise.resolve(await getResourceMockResponse(resource._id));
    }
  } else {
    inMemoryResourceMocks.push({
      _id: v4(),
      resource: resource.resource,
    });
    return Promise.resolve(await getResourceMockResponse(resource._id));
  }

  return Promise.reject();
}

export async function postSubmissionMockResponse(submission: Submission) {
  inMemorySubmissionMocks.push(submission);
}
