import { IArticle } from '../../interfaces/article';
import { ICode } from '../../interfaces/code';
import { ICourse } from '../../interfaces/course';
import { ICourseGroupMetaWithGrade } from '../../interfaces/misc';
import { IResourceMeta, ISubmissionMeta } from '../../interfaces/resource';
import { IStudent } from '../../interfaces/student';

let students: {[key: string]: IStudent} = {};

let courses: {[key: string]: ICourse} = {};

let articles: {[key: string]: IArticle} = {};

let codes: {[key: string]: ICode} = {};

let resources: {[key: string]: IResourceMeta} = {};

let submissions: {[key: string]: ISubmissionMeta} = {};

export function getIMStudents() {
  return Object.values(students);
}

export function getSubmissionsByStudent(id: string) {
  return getIMSubmissions().filter((x) => x.submittedBy._id === id);
}

export function getAttendanceByStudent(id: string): ICourseGroupMetaWithGrade[] {
  const c = getIMCourses();
  const ret: ICourseGroupMetaWithGrade[] = [];
  for (const course of c) {
    for (const group of course.groups) {
      const s = group.students.find((x) => x._id === id);
      if (s) {
        ret.push({
          active: course.active,
          courseId: course._id,
          courseName: course.name,
          groupId: group._id,
          groupName: group.name,
          ...(s.grade ? { grade: s.grade } : {}),
        });
        break;
      }
    }
  }
  return ret;
}

export function setIMStudents(_students: IStudent[]) {
  students = _students.reduce((agg, curr) => ({ ...agg, [curr._id]: curr }), {});
}

function updateCourses() {
  Object.values(courses).forEach((c) => {
    c.groups.forEach((g) => {
      const indices = g.students.map((s, i) => i).reverse();
      indices.forEach((i) => {
        const s = g.students[i];
        if (!s) {
          g.students.splice(i, 1);
        } else {
          const as = students[s._id];
          g.students[i] = as;
        }
      });
    });
    c.laboratories.forEach((lab) => {
      const gids = c.groups.map((group) => group._id);
      Object.keys(lab.tasks).forEach((tgid) => {
        if (!gids.includes(tgid)) {
          delete lab.tasks[tgid];
        }
      });
    });
  });
}

export function getIMCourses() {
  updateCourses();
  return Object.values(courses);
}

export function setIMCourses(_courses: ICourse[]) {
  courses = _courses.reduce((agg, curr) => ({ ...agg, [curr._id]: curr }), {});
}

export function getIMArticles() {
  return Object.values(articles);
}

export function setIMArticles(_articles: IArticle[]) {
  articles = _articles.reduce((agg, curr) => ({ ...agg, [curr._id]: curr }), {});
}

function updateCodes() {
  Object.values(codes).forEach((code) => {
    const c = Object.values(courses).find((x) => x._id === code.for.courseId);
    const g = c && c.groups.find((x) => x._id === code.for.groupId);
    if (!c || !g) {
      delete codes[code._id];
    } else {
      code.for.active = c.active;
      code.for.courseName = c.name;
      code.for.groupName = g.name;
    }
  });
}

export function getIMCodes() {
  updateCodes();
  return Object.values(codes);
}

export function setIMCodes(_codes: ICode[]) {
  codes = _codes.reduce((agg, curr) => ({ ...agg, [curr._id]: curr }), {});
}

export function getIMResources() {
  return Object.values(resources);
}

export function setIMResources(_resources: IResourceMeta[]) {
  resources = _resources.reduce((agg, curr) => ({ ...agg, [curr._id]: curr }), {});
}

export function getIMSubmissions() {
  return Object.values(submissions);
}

export function setIMSubmissions(_submissions: ISubmissionMeta[]) {
  submissions = _submissions.reduce((agg, curr) => ({ ...agg, [curr._id]: curr }), {});
}
