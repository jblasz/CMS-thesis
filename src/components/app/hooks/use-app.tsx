import { Course } from '../../../interfaces/course';

export interface AppContext {
  courses: Course[]
}

export function getBaseState(): AppContext {
  return {
    courses: [],
  };
}

export function useApp() {
  return {
    welcomeMessage: 'Welcome_msg',
  };
}
