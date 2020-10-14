import { loremIpsum } from 'lorem-ipsum';
import { v4 } from 'uuid';
import { Resource, Submission } from '../../interfaces/resource';
import { generateList } from '../../utils';

const inMemoryResourceMocks: Resource[] = [];

const inMemorySubmissionMocks: Submission[] = [];

export function generateResourceMocks(count = 10) {
  generateList(count).forEach(() => inMemoryResourceMocks.push(
    {
      _id: v4(),
      name: loremIpsum().split(' ').slice(0, 3).join(' '),
      resource: new ArrayBuffer(5),
    },
  ));
}

export async function getResourcesMockResponse() {
  return Promise.resolve(
    { resources: inMemoryResourceMocks.map((x) => ({ _id: x._id, name: x.name })) },
  );
}

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
      name: loremIpsum().split(' ').slice(0, 3).join(' '),
    });
    return Promise.resolve(await getResourceMockResponse(resource._id));
  }

  return Promise.reject();
}

export async function postSubmissionMockResponse(submission: Submission) {
  inMemorySubmissionMocks.push(submission);
  return Promise.resolve({ ok: true });
}

export async function putResourceNameMockResponse(_id: string, name: string) {
  const f = inMemoryResourceMocks.find((x) => x._id === _id);
  if (f) {
    f.name = name;
    return Promise.resolve({ ok: true });
  }
  return Promise.reject(new Error('Resource of id not found'));
}
