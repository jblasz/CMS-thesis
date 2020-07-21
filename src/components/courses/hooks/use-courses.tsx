import { Course } from '../../../interfaces/course';

let courses: Course[] = [];

export function useCourses() {
  return {
    courses,
    setCourses: (courseList: Course[]) => { courses = courseList; },
  };
}
