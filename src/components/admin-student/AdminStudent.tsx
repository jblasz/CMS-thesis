import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col, Container, Form, FormControl, InputGroup, Row, Table,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { ICourseGroupMetaWithGrade } from '../../interfaces/api';
import { ISubmissionMeta } from '../../interfaces/resource';
import { Student } from '../../interfaces/student';
import { getAdminUser, patchAdminUser } from '../../services/api/user.service';
import { WarningStripComponent } from '../info/WarningStrip';
import { LoadingSpinner } from '../loading-spinner';
import { SubmissionListComponent } from '../submission-list/SubmissionListCompontent';

function AdminStudentComponent(): JSX.Element {
  const { id } = useParams<{id: string}>();
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [student, setStudent] = useState<Student>(new Student());
  const [
    attendedCourseGroupLabs,
    setAttendedCourseGroupLabs,
  ] = useState<ICourseGroupMetaWithGrade[]>([]);
  const [submissions, setSubmissions] = useState<ISubmissionMeta[]>([]);

  const getAndSetAll = useCallback(async () => {
    try {
      setLoading(true);
      const {
        student: _student,
        attends: _attendedCourseGroupLabs,
        submissions: _submissions,
      } = await getAdminUser(id);
      setStudent(_student);
      setAttendedCourseGroupLabs(_attendedCourseGroupLabs);
      setSubmissions(_submissions);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getAndSetAll();
  }, [getAndSetAll]);

  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <Container>
      <WarningStripComponent error={error} />
      <Card>
        <Card.Header>
          <small>{student._id || id}</small>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <Form>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <FormControl
                      type="text"
                      onChange={(e) => {
                        student.name = e.target.value;
                        setStudent(new Student(student));
                      }}
                      value={student.name}
                    />
                  </InputGroup.Prepend>
                  <InputGroup.Text>
                    {t('ADMIN.STUDENT.NAME')}
                  </InputGroup.Text>
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <FormControl
                      type="text"
                      onChange={(e) => {
                        student.email = e.target.value;
                        setStudent(new Student(student));
                      }}
                      value={student.email}
                    />
                  </InputGroup.Prepend>
                  <InputGroup.Text>
                    {t('ADMIN.STUDENT.EMAIL')}
                  </InputGroup.Text>
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <FormControl
                      type="text"
                      onChange={(e) => {
                        student.usosId = e.target.value;
                        setStudent(new Student(student));
                      }}
                      value={student.usosId}
                    />
                  </InputGroup.Prepend>
                  <InputGroup.Text>
                    {t('ADMIN.STUDENT.USOSID')}
                  </InputGroup.Text>
                </InputGroup>
                <InputGroup>
                  <Button onClick={async () => {
                    try {
                      setLoading(true);
                      const { student: _student } = await patchAdminUser(student._id, {
                        contactEmail: student.contactEmail || '',
                        email: student.email,
                        name: student.name || '',
                        usosId: student.usosId || '',
                      });
                      setStudent(new Student(_student));
                    } catch (e) {
                      setError(e);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  >
                    {t('ADMIN.STUDENT.SAVE_CHANGES')}
                  </Button>
                </InputGroup>
              </Form>
            </Col>
            <Col>
              <Table>
                <thead>
                  <tr>
                    <th>{t('ADMIN.STUDENT.COURSE')}</th>
                    <th>{t('ADMIN.STUDENT.GROUP')}</th>
                    <th>{t('ADMIN.STUDENT.STATUS')}</th>
                    <th>{t('ADMIN.STUDENT.GRADE')}</th>
                  </tr>
                </thead>
                <tbody>
                  {attendedCourseGroupLabs.map((x) => (
                    <tr key={`${x.courseId} ${x.groupId}`}>
                      <td>
                        <Link className="nav-link" to={`/admin/courses/${x.courseId}`}>
                          {x.courseName}
                        </Link>
                      </td>
                      <td>
                        <Link className="nav-link" to={`/admin/courses/${x.groupId}`}>
                          {x.groupName}
                        </Link>
                      </td>
                      <td>
                        <p className="nav-link">
                          {x.active ? t('ADMIN.STUDENT.COURSE_ACTIVE') : t('ADMIN.STUDENT.COURSE_CLOSED')}
                        </p>
                      </td>
                      <td>
                        <p className="nav-link">{x.grade || t('ADMIN.STUDENT.NOT_YET_GRADED')}</p>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <SubmissionListComponent
        submissions={submissions}
        onSubmit={(_submissions) => setSubmissions(_submissions)}
        onUpload={() => getAndSetAll()}
        skipStudentColumn
      />
    </Container>
  );
}

export default AdminStudentComponent;
