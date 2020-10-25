import { v4 } from 'uuid';
import { Student } from '../../interfaces/student';
import { shuffleList } from '../../utils';

const inMemoryStudentMocks: Student[] = [];

let generatorCount = 0;

export function getRandomStudents(count: number) {
  return shuffleList([...inMemoryStudentMocks]).slice(0, count - 1) as Student[];
}

export function generateStudentMock(id = v4()) {
  const n = generatorCount++;
  const s = new Student({
    _id: id,
    email: `mail_${n}@domain.com`,
    name: `student Mk ${n}`,
    usosId: '123321',
  });
  inMemoryStudentMocks.push(s);
  return s;
}

export function generateStudentMocks(count = 100) {
  generateStudentMock('staticStudentID');
  for (let i = 0; i < count - 1; i++) {
    generateStudentMock();
  }
}

export function getStudentMockResponse(id: string) {
  const student = inMemoryStudentMocks.find((x) => x._id === id);
  return student ? Promise.resolve({ student }) : Promise.reject();
}

export function getStudentsMockResponse() {
  return Promise.resolve({ students: inMemoryStudentMocks.map((x) => new Student(x)) });
}

export function deleteStudentMockResponse(id: string) {
  const f = inMemoryStudentMocks.findIndex((x) => x._id === id);
  if (f > -1) {
    inMemoryStudentMocks.splice(f, 1);
    return Promise.resolve({ ok: true });
  }
  return Promise.reject(new Error('Student of this id not found'));
}
