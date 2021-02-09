import React,
{
  useCallback, useEffect, useState,
} from 'react';
import {
  Card,
  Container, Form, FormControl, InputGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ISubmissionMeta } from '../../interfaces/resource';
import { getAdminCourses } from '../../services/api/courses.service';
import { getSubmissions } from '../../services/api/submissions.service';
import { getAdminUsers } from '../../services/api/user.service';
import { WarningStripComponent } from '../info/WarningStrip';
import { LoadingSpinner } from '../loading-spinner';
import { SubmissionListComponent } from '../submission-list/SubmissionListCompontent';

interface BareData {
  id: string;
  name: string;
}

interface BareCourse extends BareData {
  students: BareData[];
}

function AdminSubmissionsComponent(): JSX.Element {
  const [t] = useTranslation();
  const [courseFilter, setCourseFilter] = useState('');
  const [studentFilter, setStudentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<number>(
    1,
  );
  const [finalFilter, setFinalFilter] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState<BareCourse[]>([]);
  const [students, setStudents] = useState<BareData[]>([]);
  const [submissions, setSubmissions] = useState<ISubmissionMeta[]>([]);
  const getSubmissionsByFilters = useCallback(async (
    cf: string, sf: string, stf: number, ff: boolean,
  ) => {
    const { submissions: _submissions } = await getSubmissions(
      cf, sf, stf, ff,
    );
    setSubmissions(_submissions);
  }, []);

  const loadFilters = useCallback(async () => {
    try {
      const [_courses, _students] = await Promise.all([
        getAdminCourses().then((x): BareCourse[] => x.courses.map((y) => ({
          id: y._id,
          name: y.name,
          students: y.groups.reduce(
            (agg: BareData[], curr): BareData[] => [
              ...agg,
              ...curr.students.map((stud) => ({
                id: stud._id,
                name: stud.name,
              })),
            ],
            [],
          ),
        }))),
        getAdminUsers().then((x) => x.students.map((y) => ({ id: y._id, name: y.name }))),
      ]);

      setCourses(_courses as BareCourse[]);
      setStudents(_students);
      if (_courses && _courses[0]) {
        setCourseFilter(_courses[0].id);
        const { submissions: _submissions } = await getSubmissions(
          _courses[0].id, '', 2, true,
        );
        setSubmissions(_submissions);
      } else {
        const { submissions: _submissions } = await getSubmissions(
          '', '', 2, true,
        );
        setSubmissions(_submissions);
      }
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFilters();
  }, [loadFilters]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <WarningStripComponent error={error} />;
  }

  return (
    <Container>
      <Card className="my-2">
        <Card.Header>
          {t('ADMIN.SUBMISSIONS.SUBMISSIONS')}
        </Card.Header>
        <Card.Body>
          <Container className="box-wrapper">
            <div className="box">
              <div className="box-inner">
                <Form>
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <FormControl
                        as="select"
                        placeholder={t('ADMIN.SUBMISSIONS.COURSE_FILTER')}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onChange={async (event: any) => {
                          try {
                            setLoading(true);
                            setCourseFilter(event.target.value);
                            await getSubmissionsByFilters(
                              event.target.value, studentFilter, statusFilter, finalFilter,
                            );
                          } catch (e) {
                            setError(e);
                          } finally {
                            setLoading(false);
                          }
                        }}
                        value={courseFilter}
                      >
                        {[
                          <option key="" value="">{t('ADMIN.SUBMISSIONS.ANY_COURSE')}</option>,
                          ...courses.map(
                            (x) => <option key={x.id} value={x.name}>{x.name}</option>,
                          ),
                        ]}
                      </FormControl>
                    </InputGroup.Prepend>
                    <InputGroup.Prepend>
                      <FormControl
                        as="select"
                        placeholder={t('ADMIN.SUBMISSIONS.STUDENT_FILTER')}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onChange={async (event: any) => {
                          try {
                            setLoading(true);
                            setStudentFilter(event.target.value);
                            await getSubmissionsByFilters(
                              courseFilter, event.target.value, statusFilter, finalFilter,
                            );
                          } catch (e) {
                            setError(e);
                          } finally {
                            setLoading(false);
                          }
                        }}
                        value={studentFilter}
                      >
                        {
                          (() => {
                            const matchedCourse = courses.find((x) => x.name === courseFilter);
                            return [
                              <option key="" value="">{t('ADMIN.SUBMISSIONS.ANY_STUDENT')}</option>,
                              ...students
                                .filter(
                                  (x) => matchedCourse?.students.map(
                                    (y) => y.name
                                    ).includes(x.name),
                                )
                                .map((x) => (<option key={x.id} value={x.name}>{x.name}</option>)),
                            ];
                          })()
                        }
                      </FormControl>
                    </InputGroup.Prepend>
                    <InputGroup.Prepend>
                      <FormControl
                        as="select"
                        placeholder={t('ADMIN.SUBMISSIONS.STATUS_FILTER')}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onChange={async (event: any) => {
                          try {
                            setLoading(true);
                            // eslint-disable-next-line radix
                            setStatusFilter(Number.parseInt(event.target.value));
                            await getSubmissionsByFilters(
                              // eslint-disable-next-line radix
                              courseFilter, studentFilter, Number.parseInt(event.target.value),
                              finalFilter,
                            );
                          } catch (e) {
                            setError(e);
                          } finally {
                            setLoading(false);
                          }
                        }}
                        value={statusFilter}
                      >
                        <option value={1}>{t('ADMIN.SUBMISSIONS.STATUS_FILTER_UNGRADED')}</option>
                        <option value={2}>{t('ADMIN.SUBMISSIONS.STATUS_FILTER_GRADED')}</option>
                        <option value={0}>{t('ADMIN.SUBMISSIONS.STATUS_FILTER_ALL')}</option>
                      </FormControl>
                    </InputGroup.Prepend>
                    <InputGroup.Append>
                      <FormControl
                        as="select"
                        placeholder={t('ADMIN.SUBMISSIONS.STATUS_FILTER')}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onChange={async (event: any) => {
                          try {
                            setLoading(true);
                            setFinalFilter(event.target.value === 'true');
                            await getSubmissionsByFilters(
                              courseFilter, studentFilter, statusFilter, event.target.value === 'true',
                            );
                          } catch (e) {
                            setError(e);
                          } finally {
                            setLoading(false);
                          }
                        }}
                        value={`${finalFilter}`}
                      >
                        <option value="true">{t('ADMIN.SUBMISSIONS.FINAL_FILTER_TRUE')}</option>
                        <option value="false">{t('ADMIN.SUBMISSIONS.FINAL_FILTER_FALSE')}</option>
                      </FormControl>
                    </InputGroup.Append>
                  </InputGroup>
                  <Form.Row>
                    <SubmissionListComponent
                      submissions={submissions}
                      onSubmit={(_submissions) => setSubmissions(_submissions)}
                      onUpload={() => getSubmissionsByFilters(
                        courseFilter, studentFilter, statusFilter, finalFilter,
                      )}
                      skipStudentColumn={false}
                    />
                  </Form.Row>
                </Form>
              </div>
            </div>
          </Container>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AdminSubmissionsComponent;
