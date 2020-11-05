import { v4 } from 'uuid';
import {
  ApiPostResponse,
  GetCodesResponse, PostCodeNewResponse, PostCodeResponse, PostCodeResponseType,
} from '../../interfaces/api';

export async function postCodeMockResponse(code: string): Promise<PostCodeResponse> {
  if (code === 'course-signup-mock-code') {
    return Promise.resolve({
      ok: true,
      type: PostCodeResponseType.COURSE_SIGNUP,
      courseSignup: {
        active: true,
        courseId: v4(),
        courseName: 'course name',
        groupId: v4(),
        groupName: 'group name',
      },
    });
  }
  return Promise.reject();
}

export async function getCodesMockResponse(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  grabInactive = false, courseId?: string,
): Promise<GetCodesResponse> {
  return Promise.resolve({
    codes: [
      {
        _id: v4(),
        usedBy: [
          {
            _id: v4(),
            name: 'name1',
            email: 'email1',
            registeredAt: new Date(0),
            usosId: 'usosid1',
          },
          {
            _id: v4(),
            name: 'name2',
            email: 'email2',
            registeredAt: new Date(0),
            usosId: 'usosid2',
          },
        ],
        validThrough: new Date(2021, 0, 1),
        valid: true,
      },
      {
        _id: v4(),
        usedBy: [
          {
            _id: v4(),
            name: 'name1',
            email: 'email1',
            registeredAt: new Date(0),
            usosId: 'usosid1',
          },
          {
            _id: v4(),
            name: 'name2',
            email: 'email2',
            registeredAt: new Date(0),
            usosId: 'usosid2',
          },
          {
            _id: v4(),
            name: 'name3',
            email: 'email3',
            registeredAt: new Date(0),
            usosId: 'usosid3',
          },
        ],
        validThrough: new Date(2020, 0, 1),
        valid: false,
      },
    ],
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function postCodeNewMockResponse(
  courseid: string,
  validThrough: Date,
): Promise<PostCodeNewResponse> {
  return Promise.resolve({
    code: {
      _id: v4(),
      usedBy: [],
      valid: true,
      validThrough,
    },
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function deleteCodeMockResponse(code: string): Promise<ApiPostResponse> {
  return {
    ok: true,
  };
}
