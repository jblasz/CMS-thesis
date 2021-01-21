import { v4 } from 'uuid';
import {
  Course, ICourse, ICourseStubCore,
} from '../../interfaces/course';
import { CourseLaboratory, ICourseLaboratory } from '../../interfaces/courseLaboratory';
import { CourseGroup, ICourseGroup, IGroupStub } from '../../interfaces/courseGroup';
import {
  IApiPostResponse,
  IGetCourseGroupResponse,
  IGetCourseResponse,
  IGetDashboardLaboratoriesResponse,
  IGetLaboratoryResponse,
  IPatchCourseGroupStudentResponse,
  IPostCourseGroupResponse,
  IPostCourseResponse,
  IPutCourseLaboratoryResponse,
  IPutCourseLaboratoryTaskResponse,
} from '../../interfaces/api';
import { getIMCourses, getIMStudents, setIMCourses } from './in-memory-database';
import { IPendingLaboratory } from '../../interfaces/misc';
import { CourseTask } from '../../interfaces/courseTask';

export async function getCoursesListMockResponse() {
  return Promise.resolve({ courses: getIMCourses() });
}

export async function getCourseMockResponse(_id: string): Promise<IGetCourseResponse> {
  const f = getIMCourses().find((x) => x._id === _id);
  if (f) {
    return Promise.resolve({ course: new Course(f) });
  }
  return Promise.reject(new Error('404 not found'));
}

export async function getCourseGroupMockResponse(
  courseID: string, groupID: string,
): Promise<IGetCourseGroupResponse> {
  const course = getIMCourses().find((x) => x._id === courseID);
  const group = course && course.groups.find((x) => x._id === groupID);
  if (course && group) {
    return Promise.resolve(
      { group: new CourseGroup(group), courseId: course._id, courseName: course.name },
    );
  }
  return Promise.reject(new Error('404 not found'));
}

export async function putCourseMockResponse(course: ICourseStubCore): Promise<IPostCourseResponse> {
  const courses = getIMCourses();
  if (course._id) {
    const f = courses.find((x) => x._id === course._id);
    if (f) {
      f._id = course._id;
      f.active = course.active;
      f.description = course.description;
      f.descriptionShort = course.descriptionShort;
      f.language = course.language;
      f.name = course.name;
      f.semester = course.semester;
      f.shown = course.shown;
      return Promise.resolve(
        {
          ok: true,
          course: (await getCourseMockResponse(course._id)).course,
        },
      );
    }
    return Promise.reject();
  }
  const n = new Course({
    ...course,
    _id: v4(),
    groups: [],
    laboratories: [],
  });
  courses.push(n);
  setIMCourses(courses);

  return Promise.resolve({ ok: true, course: (await getCourseMockResponse(n._id)).course });
}

export async function deleteCourseMockResponse(_id: string) {
  const courses = getIMCourses();
  const f = courses.findIndex((x) => x._id === _id);
  if (f > -1) {
    courses.splice(f, 1);
    return Promise.resolve({ ok: true });
  }
  return Promise.reject(new Error('404 not found'));
}

export async function setCourseGroupResponse(
  courseID: string,
  group: IGroupStub,
): Promise<IPostCourseGroupResponse> {
  const course = getIMCourses().find((x) => x._id === courseID);
  if (!course) {
    return Promise.reject();
  }
  if (group._id) {
    const toReplace = course.groups.find((x) => x._id === group._id);
    if (toReplace) {
      toReplace._id = group._id;
      toReplace.name = group.name;
      return Promise.resolve(
        { ok: true, group: (await getCourseGroupMockResponse(course._id, group._id)).group },
      );
    }
  } else {
    course.groups.push(new CourseGroup({
      ...group,
      _id: v4(),
      students: [],
    }));
    return Promise.resolve(
      { ok: true, group: (await getCourseGroupMockResponse(course._id, group._id)).group },
    );
  }
  return Promise.reject(new Error('404 not found'));
}

export async function getLaboratoryMockResponse(
  courseID: string,
  labID: string,
): Promise<IGetLaboratoryResponse> {
  const course = getIMCourses().find((x) => x._id === courseID);
  const lab = course && course.laboratories.find((x) => x._id === labID);

  if (course && lab) {
    return Promise.resolve(
      { laboratory: new CourseLaboratory(lab), courseName: course.name, courseId: course._id },
    );
  }
  return Promise.reject(new Error('404 not found'));
}

export async function putAdminCourseLaboratoryTaskMockResponse(
  courseID: string, labID: string, groupID: string, task: CourseTask,
): Promise<IPutCourseLaboratoryTaskResponse> {
  const course = getIMCourses().find((x) => x._id === courseID);
  const lab = course && course.laboratories.find((x) => x._id === labID);
  const groupExists = course && course.groups.find((x) => x._id === groupID);
  if (!course || !lab || !groupExists) {
    throw new Error('Group, course or lab doesnt exist');
  }
  lab.tasks[groupID] = task;
  return Promise.resolve({
    ok: true,
    task,
  });
}

export async function setCourseLabMockResponse(
  courseID: string,
  lab: CourseLaboratory,
): Promise<IPutCourseLaboratoryResponse> {
  const course = getIMCourses().find((x) => x._id === courseID);
  if (!course) {
    return Promise.reject(new Error('404 not found'));
  }
  if (lab._id) {
    const toReplace = course.laboratories.find((x) => x._id === lab._id);
    if (toReplace) {
      toReplace._id = lab._id;
      toReplace.description = lab.description;
      toReplace.descriptionShort = lab.descriptionShort;
      toReplace.name = lab.name;
      course.groups.forEach((group) => {
        if (!toReplace.tasks[group._id]) {
          toReplace.tasks[group._id] = new CourseTask();
        }
      });
      return Promise.resolve(
        {
          ok: true,
          laboratory: (await getLaboratoryMockResponse(course._id, toReplace._id)).laboratory,
        },
      );
    }
  } else {
    const topush = new CourseLaboratory({
      ...lab,
      _id: v4(),
    });
    course.laboratories.push(topush);
    return Promise.resolve(
      {
        ok: true,
        laboratory: (await getLaboratoryMockResponse(course._id, topush._id)).laboratory,
      },
    );
  }
  return Promise.reject(new Error('404 not found'));
}

export async function patchCourseGroupStudentMockResponse(
  studentID: string,
  courseID: string,
  groupID: string,
): Promise<IPatchCourseGroupStudentResponse> {
  const course = getIMCourses().find((x) => x._id === courseID);
  const group = course && course.groups.find((x) => x._id === groupID);
  const student = getIMStudents().find((x) => x._id === studentID);
  if (course && group && student) {
    if (!group.students.find((x) => x._id === student._id)) {
      group.students.push(student);
    }
    return Promise.resolve({ ok: true, group });
  }
  return Promise.reject(new Error('404 not found'));
}

export async function deleteGroupMockResponse(
  courseID: string, groupID: string,
): Promise<IApiPostResponse> {
  const course = getIMCourses().find((x) => x._id === courseID);
  if (course) {
    const i = course.groups.findIndex((x) => x._id === groupID);
    if (i > -1) {
      course.groups.splice(i, 1);
      return Promise.resolve({ ok: true });
    }
  }
  return Promise.reject();
}

export async function deleteLaboratoryMockResponse(
  courseID: string,
  labID: string,
): Promise<IApiPostResponse> {
  const course = getIMCourses().find((x) => x._id === courseID);
  if (!course) {
    return Promise.reject(new Error('No course of this id'));
  }
  const f = course.laboratories.findIndex((x) => x._id === labID);
  if (f > -1) {
    course.laboratories.splice(f, 1);
    return Promise.resolve({ ok: true });
  }
  return Promise.reject(new Error('No lab of this id'));
}

export async function getDashboardLaboratoriesMockResponse(studentID: string):
Promise<IGetDashboardLaboratoriesResponse> {
  const student = getIMStudents().find((x) => x._id === studentID);
  if (!student) {
    throw new Error('404 not found');
  }
  const groups: [ICourse, ICourseGroup, ICourseLaboratory][] = [];
  const d2 = new Date();
  d2.setDate(d2.getDate() + 7);
  getIMCourses().forEach((course) => {
    const g = course.groups.find((group) => group.students.find((s) => s._id === student._id));
    const l = g && course.laboratories.find((lab) => {
      const task = lab.tasks[g._id];
      return task.dateTo && task.dateTo.valueOf() <= d2.valueOf();
    });
    if (g && l) {
      groups.push([course, g, l]);
    }
  });

  return Promise.resolve({
    laboratories: groups.map((x): IPendingLaboratory => {
      const [c, g, l] = x;
      return {
        courseId: c._id,
        courseName: c.name,
        endsAt: l.tasks[g._id].dateTo as Date,
        groupId: g._id,
        groupName: g.name,
        labId: l._id,
        labName: l.name,
        startsAt: l.tasks[g._id].dateFrom as Date,
        active: c.active,
      };
    }),
  });
}

export async function deleteCourseGroupStudentMockResponse(
  courseID: string, groupID: string, studentID: string,
): Promise<IApiPostResponse> {
  const course = getIMCourses().find((x) => x._id === courseID);
  const group = course && course.groups.find((x) => x._id === groupID);
  const student = getIMStudents().find((x) => x._id === studentID);
  if (course && group && student) {
    const i = group.students.findIndex((x) => x._id === studentID);
    if (i > -1) {
      group.students.splice(i, 1);
    }
    return Promise.resolve({ ok: true });
  }
  throw new Error('404 not found');
}
