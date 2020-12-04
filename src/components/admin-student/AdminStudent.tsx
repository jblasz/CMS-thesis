import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col, Container, Form, FormControl, InputGroup, ListGroup, Row,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { ICourseGroupMetaWithGrade } from '../../interfaces/api';
import { ISubmissionMeta } from '../../interfaces/resource';
import { Student } from '../../interfaces/student';
import { getStudent } from '../../services/api/students.service';
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
      } = await getStudent(id);
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
                  <Button>
                    {t('ADMIN.STUDENT.SAVE_CHANGES')}
                  </Button>
                </InputGroup>
              </Form>
            </Col>
            <Col>
              <ListGroup>
                <ListGroup.Item>
                  {t('ADMIN.STUDENT.PARTOOK_IN_COURSES')}
                </ListGroup.Item>
                {attendedCourseGroupLabs.map((x) => (
                  <ListGroup.Item key={`${x.courseId} ${x.groupId}`}>
                    <Row>
                      <Col>
                        <Link className="nav-link" to={`/admin/courses/${x.courseId}`}>
                          {x.courseName}
                        </Link>
                      </Col>
                      <Col>
                        <Link className="nav-link" to={`/admin/courses/${x.groupId}`}>
                          {x.groupName}
                        </Link>
                      </Col>
                      <Col>
                        <p className="nav-link">
                          {x.active ? t('ADMIN.STUDENT.COURSE_ACTIVE') : t('ADMIN.STUDENT.COURSE_CLOSED')}
                        </p>
                      </Col>
                      <Col>
                        <p className="nav-link">{x.grade || t('ADMIN.STUDENT.NOT_YET_GRADED')}</p>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
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
