import { loremIpsum } from 'lorem-ipsum';
import { v4 } from 'uuid';
import { Permission, ResourceMeta, SubmissionMeta } from '../../interfaces/resource';
import { generateList } from '../../utils';

const inMemoryResourceMocks: ResourceMeta[] = [];

const inMemorySubmissionMocks: SubmissionMeta[] = [];

export function getResourceMocks() {
  return [...inMemoryResourceMocks];
}

function roll(min:number, max: number) {
  return Math.floor(Math.random() * (max - min));
}

export function grabRandomResource() {
  if (!inMemoryResourceMocks.length) {
    inMemoryResourceMocks.push({
      _id: v4(),
      name: loremIpsum().split(' ').slice(0, 3).join(' '),
      permission: Permission.ALL,
      usedBy: [],
    });
  }
  return inMemoryResourceMocks[roll(0, inMemoryResourceMocks.length)];
}

export function generateResourceMocks(count = 10) {
  generateList(count).forEach(() => inMemoryResourceMocks.push(
    {
      _id: v4(),
      name: loremIpsum().split(' ').slice(0, 3).join(' '),
      usedBy: [],
      permission: Permission.ALL,
    },
  ));
}

export async function getResourceMockResponse(id: string) {
  const f = inMemoryResourceMocks.find((x) => x._id === id);
  if (f) {
    return Promise.resolve(f);
  }
  return Promise.reject(new Error('Resource of given id not found'));
}

export async function putResourceMockResponse(resource: ResourceMeta) {
  if (resource._id) {
    const f = inMemoryResourceMocks.findIndex((x) => x._id === resource._id);
    if (f > -1) {
      inMemoryResourceMocks[f] = resource;
      return Promise.resolve(await getResourceMockResponse(resource._id));
    }
  } else {
    const topush: ResourceMeta = {
      _id: v4(),
      name: resource.name,
      permission: Permission.ALL,
      usedBy: [],
    };
    inMemoryResourceMocks.push(topush);
    return Promise.resolve(await getResourceMockResponse(topush._id));
  }

  return Promise.reject(new Error('Resource has id, but isnt in memory'));
}

export async function postSubmissionMockResponse(submission: SubmissionMeta) {
  inMemorySubmissionMocks.push(submission);
  return Promise.resolve({ ok: true });
}

export async function patchResourceMockResponse(_id: string, name: string, permission: Permission) {
  const f = inMemoryResourceMocks.find((x) => x._id === _id);
  if (f) {
    f.name = name;
    f.permission = permission;
    return Promise.resolve({ ok: true });
  }
  return Promise.reject(new Error('Resource of id not found'));
}

export async function deleteResourceMockResponse(_id: string) {
  const f = inMemoryResourceMocks.findIndex((x) => x._id === _id);
  if (f > -1) {
    inMemoryResourceMocks.splice(f, 1);
    return Promise.resolve({ ok: true });
  }
  return Promise.reject(new Error('Failed to find resource of given id'));
}
