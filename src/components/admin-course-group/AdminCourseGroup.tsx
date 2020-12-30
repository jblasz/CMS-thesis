import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Form, Button, Table, InputGroup, FormControl,
} from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { faSave, faSort, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  deleteAdminCourseGroup, deleteCourseGroupStudent, getAdminCourseGroup, patchCourseGroupStudent,
} from '../../services/api/courses.service';
import { LoadingSpinner } from '../loading-spinner';
import { CourseGroup } from '../../interfaces/courseGroup';
import { getCodes, postCodeNew } from '../../services/api/codes.service';
import { formatDate } from '../../utils';
import { Code } from '../../interfaces/code';
import { AdminCodesListComponent } from '../admin-codes/AdminCodesList';
import { SubmissionGrade } from '../../interfaces/resource';
import { WarningStripComponent } from '../info/WarningStrip';
import { getAdminUsers } from '../../services/api/user.service';

interface BaseStudent {
  _id: string
  name: string
}

function AdminCourseGroupComponent(): JSX.Element {
  const { groupID, courseID } = useParams<{groupID: string, courseID: string}>();
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortDirection, setSortDirection] = useState(1);
  const [newStudent, setNewStudent] = useState<BaseStudent>({ _id: '', name: '' });
  const [
    validThrough,
    // setValidThrough,
  ] = useState(new Date(new Date().valueOf() + 31 * 24 * 60 * 60 * 1000));
  const [newCode, setNewCode] = useState({ _id: '', validThrough: new Date(0) });
  const [
    { students, group },
    setGroupAndStudents,
  ] = useState<{
    students: BaseStudent[],
    group: CourseGroup}>({ students: [], group: new CourseGroup() });
  const [codes, setCodes] = useState<Code[]>([]);

  const validateAndSetCourseGroup = useCallback(
    (_group: CourseGroup, _students: BaseStudent[]) => {
      const res = _group.validate();
      if (res.error) {
        setError(res.error);
      }
      setGroupAndStudents({ group: _group, students: _students });
    }, [],
  );

  const getAndSetBoth = useCallback(async () => {
    try {
      setLoading(true);
      const [{ group: _group }, { students: _students }, { codes: _codes }] = await Promise.all(
        [getAdminCourseGroup(courseID, groupID), getAdminUsers(), getCodes(true, courseID)],
      );
      const filtered = _students
        .filter((x) => !_group.students.find((y) => y._id === x._id))
        .map((x) => ({ _id: x._id, name: x.name }));
      validateAndSetCourseGroup(
        new CourseGroup(_group), filtered,
      );
      setNewStudent(filtered[0]);
      setCodes(_codes);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [groupID, courseID, validateAndSetCourseGroup]);

  useEffect(() => {
    getAndSetBoth();
  }, [groupID, getAndSetBoth]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <Form>
        <WarningStripComponent error={error} />
        <Button
          className="float-right"
          onClick={async () => {
            try {
              setLoading(true);
              await deleteAdminCourseGroup(courseID, group._id);
              alert('course deleted succesfully');
              await getAndSetBoth();
            } catch (e) {
              console.error(e);
              setError(e);
              alert('failed to delete course, details in console');
            } finally {
              setLoading(false);
            }
          }}
        >
          <FontAwesomeIcon icon={faTrash} />
        </Button>
        <Form.Row className="my-2">
          <InputGroup>
            <Form.Control
              style={{ maxWidth: '500px' }}
              as="select"
              value={newStudent._id}
              onChange={
                (e) => setNewStudent(
                  students.find((x) => x._id === e.target.value) as BaseStudent,
                )
              }
            >
              {students.map(
                (student) => (
                  <option key={student._id} value={student._id}>
                    {student.name || student._id}
                  </option>
                ),
              )}
            </Form.Control>
            <InputGroup.Append>
              <Button
                className="py-0"
                onClick={async () => {
                  try {
                    if (!newStudent) {
                      return;
                    }
                    setLoading(true);
                    await patchCourseGroupStudent(courseID, groupID, newStudent._id);
                    await getAndSetBoth();
                  } catch (e) {
                    alert('failed to add student');
                    console.error(e);
                    setError(e);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {t('ADMIN.GROUP.ADD_STUDENT')}
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Form.Row>
        <Form.Row className="my-2">
          <InputGroup>
            <InputGroup.Prepend>
              <Button
                className="p-2"
                onClick={async () => {
                  try {
                    setLoading(true);
                    const { code } = await postCodeNew(groupID, validThrough);
                    setNewCode({ _id: code._id, validThrough: code.validThrough });
                  } catch (e) {
                    console.error(e);
                    setError(e);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {t('ADMIN.COURSE.GENERATE_CODE')}
              </Button>
            </InputGroup.Prepend>
            {
              newCode._id ? (
                <>
                  <InputGroup.Text>
                    {newCode._id}
                  </InputGroup.Text>
                  <InputGroup.Text>
                    {formatDate(newCode.validThrough)}
                  </InputGroup.Text>
                </>
              ) : null
            }
          </InputGroup>
        </Form.Row>
        <AdminCodesListComponent codes={codes} />
      </Form>
      <Table responsive>
        <thead>
          <tr>
            <th>
              {t('ADMIN.GROUP.STUDENTS_ID')}
              <Button
                variant="light"
                onClick={() => {
                  group.students.sort((a, b) => sortDirection * a._id.localeCompare(b._id));
                  setSortDirection(-sortDirection);
                }}
              >
                <FontAwesomeIcon
                  icon={faSort}
                />
              </Button>
            </th>
            <th>
              {t('ADMIN.GROUP.STUDENTS_NAME')}
              <Button
                variant="light"
                onClick={() => {
                  group.students.sort((a, b) => sortDirection * (a.name || '').localeCompare(b.name || ''));
                  setSortDirection(-sortDirection);
                }}
              >
                <FontAwesomeIcon
                  icon={faSort}
                />
              </Button>
            </th>
            <th>
              {t('ADMIN.GROUP.STUDENTS_CONTACT_EMAIL')}
              <Button
                variant="light"
                onClick={() => {
                  group.students.sort((a, b) => sortDirection * (a.contactEmail || '').localeCompare(b.contactEmail || ''));
                  setSortDirection(-sortDirection);
                }}
              >
                <FontAwesomeIcon
                  icon={faSort}
                />
              </Button>
            </th>
            <th>
              {t('ADMIN.GROUP.STUDENTS_EMAIL')}
              <Button
                variant="light"
                onClick={() => {
                  group.students.sort((a, b) => sortDirection * (a.email || '').localeCompare(b.email || ''));
                  setSortDirection(-sortDirection);
                }}
              >
                <FontAwesomeIcon
                  icon={faSort}
                />
              </Button>
            </th>
            <th>{t('ADMIN.GROUP.STUDENTS_FINAL_GRADE')}</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {group.students.map((student) => (
            <tr key={student._id}>
              <td><Link to={`/admin/students/${student._id}`}>{student._id}</Link></td>
              <td>{student.name || t('ADMIN.GROUP.STUDENT_NA')}</td>
              <td>{student.contactEmail || t('ADMIN.GROUP.STUDENT_NA')}</td>
              <td>{student.email || t('ADMIN.GROUP.STUDENT_NA')}</td>
              <td>
                <Form>
                  <InputGroup>
                    <FormControl
                      as="select"
                      placeholder={t('ADMIN.GROUP.STUDENT_GRADE')}
                      onChange={(e) => {
                        student.grade = e.target.value as SubmissionGrade;
                        setGroupAndStudents({ group, students });
                      }}
                      value={student.grade}
                    >
                      {[
                        <option key="" value={undefined}>{' '}</option>,
                        <option
                          key={SubmissionGrade.A}
                          value={SubmissionGrade.A}
                        >
                          {SubmissionGrade.A}
                        </option>,
                        <option
                          key={SubmissionGrade.B_PLUS}
                          value={SubmissionGrade.B_PLUS}
                        >
                          {SubmissionGrade.B_PLUS}
                        </option>,
                        <option
                          key={SubmissionGrade.B}
                          value={SubmissionGrade.B}
                        >
                          {SubmissionGrade.B}
                        </option>,
                        <option
                          key={SubmissionGrade.C_PLUS}
                          value={SubmissionGrade.C_PLUS}
                        >
                          {SubmissionGrade.C_PLUS}
                        </option>,
                        <option
                          key={SubmissionGrade.C}
                          value={SubmissionGrade.C}
                        >
                          {SubmissionGrade.C}
                        </option>,
                        <option
                          key={SubmissionGrade.F}
                          value={SubmissionGrade.F}
                        >
                          {SubmissionGrade.F}
                        </option>,
                      ]}
                    </FormControl>
                    <InputGroup.Append>
                      <Button
                        className="py-0"
                        onClick={async () => {
                          try {
                            setLoading(true);
                            await patchCourseGroupStudent(
                              courseID, groupID, student._id, student.grade || null,
                            );
                            await getAndSetBoth();
                          } catch (e) {
                            setError(e);
                          } finally {
                            setLoading(false);
                          }
                        }}
                      >
                        <FontAwesomeIcon icon={faSave} />
                      </Button>
                    </InputGroup.Append>
                  </InputGroup>
                </Form>
              </td>
              <td>
                <Button
                  onClick={async () => {
                    try {
                      setLoading(true);
                      await deleteCourseGroupStudent(courseID, groupID, student._id);
                      await getAndSetBoth();
                    } catch (e) {
                      setError(e);
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default AdminCourseGroupComponent;
