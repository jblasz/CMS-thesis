import { v4 } from 'uuid';
import {
  Permission, IUsedBy,
} from '../../interfaces/resource';
import {
  getIMCourses, getIMResources, getIMSubmissions, setIMResources, setIMSubmissions,
} from './in-memory-database';

export function getLabsReferencingResourceId(id: string): IUsedBy[] {
  const courses = getIMCourses();
  const matches: IUsedBy[] = [];
  for (const course of courses) {
    for (const lab of course.laboratories) {
      const groupId = Object.keys(lab.tasks).find((gid) => lab.tasks[gid].resourceId === id);
      if (groupId) {
        matches.push({
          courseId: course._id, courseName: course.name, labId: lab._id, labName: lab.name, groupId,
        });
      }
    }
  }
  return matches;
}

export async function getResourceMockResponse(id: string) {
  const f = getIMResources().find((x) => x._id === id);
  if (f) {
    return Promise.resolve({ resource: f });
  }
  return Promise.reject(new Error('Resource of given id not found'));
}

export async function putResourceMockResponse(id: string) {
  const resources = getIMResources();
  if (id) {
    const f = resources.findIndex((x) => x._id === id);
    if (f > -1) {
      return Promise.resolve({ ok: true, ...await getResourceMockResponse(id) });
    }
  } else {
    const n = {
      _id: v4(),
      name: 'NEW_NAME',
      permission: Permission.NONE,
      usedBy: [],
    };
    resources.push(n);
    setIMResources(resources);
    return Promise.resolve({ ok: true, ...await getResourceMockResponse(n._id) });
  }

  return Promise.reject(new Error('Resource has id, but isnt in memory'));
}

export async function postSubmissionMockResponse(
  courseID: string,
  laboratoryID: string,
  data: FormData,
  studentID: string,
  note: string,
) {
  const course = getIMCourses().find((x) => x._id === courseID);
  const group = course && course.groups.find((x) => x.students.find((y) => y._id === studentID));
  const student = group && group.students.find((x) => x._id === studentID);
  const lab = course && course.laboratories.find((x) => x._id === laboratoryID);
  const task = lab && group && lab.tasks[group._id];
  if (!course || !group || !lab || !task || !student) {
    throw new Error('Course not found');
  }
  if (
    !task.dateFrom
    || !task.dateTo
    || task.dateFrom.valueOf() > new Date().valueOf()
    || task.dateTo.valueOf() + task.gracePeriod * 60 * 1000 < new Date().valueOf()) {
    throw new Error('Too late, too early, or task not fully defined yet');
  }

  const submissions = getIMSubmissions();
  submissions.filter((x) => x.submittedBy._id === studentID
    && x.forCourseID === courseID
    && x.forGroupID === group._id
    && x.forLabID === laboratoryID)
    .forEach((s) => {
      s.final = false;
    });

  setIMSubmissions([...submissions, {
    _id: v4(),
    final: true,
    forCourseID: courseID,
    forCourseName: course.name,
    forGroupID: group._id,
    forGroupName: group.name,
    forLabID: lab._id,
    forLabName: lab.name,
    note,
    submittedAt: new Date(),
    submittedBy: student,
  }]);
  return Promise.resolve({ ok: true });
}

export async function patchResourceMockResponse(_id: string, name: string, permission: Permission) {
  if (_id) {
    const resources = getIMResources();
    const f = resources.findIndex((x) => x._id === _id);
    if (f > -1) {
      resources[f].name = name;
      resources[f].permission = permission;
      setIMResources(resources);
      return Promise.resolve({ ok: true, ...await getResourceMockResponse(_id) });
    }
    throw new Error('Resource id exists but not found');
  }
  const id = v4();
  setIMResources([
    ...getIMResources(),
    {
      _id: id,
      name,
      permission,
      usedBy: [],
    },
  ]);
  return Promise.resolve({ ok: true, ...await getResourceMockResponse(id) });
}

export async function deleteResourceMockResponse(_id: string) {
  const resources = getIMResources();
  const f = resources.findIndex((x) => x._id === _id);
  if (f > -1) {
    resources.splice(f, 1);
    setIMResources(resources);
    return Promise.resolve({ ok: true });
  }
  return Promise.reject(new Error('Failed to find resource of given id'));
}
