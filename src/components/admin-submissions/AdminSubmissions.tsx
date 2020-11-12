import React,
{
  useCallback, useEffect, useState,
} from 'react';
import {
  Container, Form, FormControl, InputGroup, Row,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { SubmissionMeta } from '../../interfaces/resource';
import { getCourses } from '../../services/api/courses.service';
import { getStudents } from '../../services/api/students.service';
import { getSubmissions } from '../../services/api/submissions.service';
import { LoadingSpinner } from '../loading-spinner';
import { SubmissionListComponent } from '../submission-list/SubmissionListCompontent';

interface BareData {
  id: string;
  name: string;
}

interface BareCourse extends BareData {
  students: BareData[];
}

enum StatusFilter {
  ALL = 0,
  UNGRADED,
  GRADED,
}

function AdminSubmissionsComponent(): JSX.Element {
  const [t] = useTranslation();
  const [courseFilter, setCourseFilter] = useState('');
  const [studentFilter, setStudentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    StatusFilter.UNGRADED,
  );
  const [finalFilter, setFinalFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [courses, setCourses] = useState<BareCourse[]>([]);
  const [students, setStudents] = useState<BareData[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionMeta[]>([]);
  const getSubmissionsByFilters = useCallback(async () => {
    const { submissions: _submissions } = await getSubmissions(
      courseFilter, studentFilter, statusFilter,
    );
    setSubmissions(_submissions);
  }, [courseFilter, studentFilter, statusFilter]);

  const loadFilters = useCallback(async () => {
    try {
      const [_courses, _students] = await Promise.all([
        getCourses().then((x): BareCourse[] => x.courses.map((y) => ({
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
        getStudents().then((x) => x.students.map((y) => ({ id: y._id, name: y.name }))),
      ]);

      setCourses(_courses as BareCourse[]);
      setStudents(_students);
      await getSubmissionsByFilters();
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [getSubmissionsByFilters]);

  useEffect(() => {
    loadFilters();
  }, [loadFilters]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      {error ? (
        <Row className="error-strip">{`${t('COMMON.ERROR')}: ${error}`}</Row>
      ) : (
        ''
      )}
      <Form>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <FormControl
              as="select"
              placeholder={t('ADMIN.SUBMISSIONS.COURSE_FILTER')}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e: any) => {
                setCourseFilter(e.target.value);
                getSubmissionsByFilters();
              }}
              value={courseFilter}
            >
              {[
                <option key="" value="">{t('ADMIN.SUBMISSIONS.ANY_COURSE')}</option>,
                ...courses.map((x) => <option key={x.id} value={x.id}>{x.name}</option>),
              ]}
            </FormControl>
            <FormControl
              as="select"
              placeholder={t('ADMIN.SUBMISSIONS.STUDENT_FILTER')}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e: any) => {
                setStudentFilter(e.target.value);
                getSubmissionsByFilters();
              }}
              value={studentFilter}
            >
              {
                (() => {
                  const matchedCourse = courses.find((x) => x.id === courseFilter);
                  return [
                    <option key="" value="">{t('ADMIN.SUBMISSIONS.ANY_STUDENT')}</option>,
                    ...students
                      .filter((x) => matchedCourse?.students.map((y) => y.id).includes(x.id))
                      .map((x) => (<option key={x.id} value={x.id}>{x.name}</option>)),
                  ];
                })()
              }
            </FormControl>
            <FormControl
              as="select"
              placeholder={t('ADMIN.SUBMISSIONS.STATUS_FILTER')}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e: any) => {
                setStatusFilter(e.target.value);
                getSubmissionsByFilters();
              }}
              value={statusFilter}
            >
              <option value={StatusFilter.UNGRADED}>{t('ADMIN.SUBMISSIONS.STATUS_FILTER_UNGRADED')}</option>
              <option value={StatusFilter.GRADED}>{t('ADMIN.SUBMISSIONS.STATUS_FILTER_GRADED')}</option>
              <option value={StatusFilter.ALL}>{t('ADMIN.SUBMISSIONS.STATUS_FILTER_ALL')}</option>
            </FormControl>
            <FormControl
              as="select"
              placeholder={t('ADMIN.SUBMISSIONS.STATUS_FILTER')}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e: any) => {
                setFinalFilter(e.target.value);
                getSubmissionsByFilters();
              }}
              value={`${finalFilter}`}
            >
              <option value="true">{t('ADMIN.SUBMISSIONS.FINAL_FILTER_TRUE')}</option>
              <option value="false">{t('ADMIN.SUBMISSIONS.FINAL_FILTER_FALSE')}</option>
            </FormControl>
          </InputGroup.Prepend>
        </InputGroup>
        <Form.Row>
          <SubmissionListComponent
            submissions={submissions}
            onSubmit={(_submissions) => setSubmissions(_submissions)}
            onUpload={() => getSubmissionsByFilters()}
            skipStudentColumn={false}
            admin
          />
        </Form.Row>
      </Form>
    </Container>
  );
}

export default AdminSubmissionsComponent;
