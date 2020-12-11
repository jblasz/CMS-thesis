import {
  faDownload, faClipboard,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Table, Button, Container, ButtonGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SubmissionGrade, ISubmissionMeta } from '../../interfaces/resource';
import { getSubmissions } from '../../services/api/submissions.service';
import { formatDate } from '../../utils';
import { WarningStripComponent } from '../info/WarningStrip';
import { LoadingSpinner } from '../loading-spinner';

export function StudentSubmissionListComponent(): JSX.Element {
  const [submissions, setSubmissions] = useState<ISubmissionMeta[]>([]);
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getAndSetSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const { submissions: _submissions } = await getSubmissions('', '', 0);
      setSubmissions(_submissions);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAndSetSubmissions();
  }, [getAndSetSubmissions]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!submissions.length) {
    return (
      <Container>
        <h6>{t('STUDENT.SUBMISSIONS.NO_SUBMISSIONS')}</h6>
      </Container>
    );
  }

  return (
    <Container className="student-submission-list">
      <WarningStripComponent error={error} />
      <Table className="table-sm">
        <thead>
          <tr>
            <th>{t('STUDENT.SUBMISSIONS.COURSE')}</th>
            <th>{t('STUDENT.SUBMISSIONS.LAB')}</th>
            <th>{t('STUDENT.SUBMISSIONS.GRADE')}</th>
            <th>{t('STUDENT.SUBMISSIONS.SUBMITTED_AT')}</th>
            <th>{' '}</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => {
            const className = !submission.final
              ? 'table-secondary'
              : !submission.grade
                ? 'table-info'
                : submission.grade === SubmissionGrade.F
                  ? 'table-danger'
                  : 'table-success';
            return (
              <tr
                className={className}
                key={submission._id}
              >
                <td>
                  <Link className="nav-link" to={`/courses/${submission.forCourseID}`}>
                    {submission.forCourseName}
                  </Link>
                </td>
                <td>
                  <Link className="nav-link" to={`/courses/${submission.forCourseID}/laboratory/${submission.forLabID}`}>
                    {submission.forLabName}
                  </Link>
                </td>
                <td>
                  <p>{submission.grade || t('STUDENT.SUBMISSIONS.NO_GRADE_YET')}</p>
                </td>
                <td>
                  <p>
                    {formatDate(submission.submittedAt, true)}
                  </p>
                </td>
                <td>
                  <ButtonGroup>
                    <Button title={t('STUDENT.SUBMISSIONS.DOWNLOAD_SUBMISSION')}><FontAwesomeIcon icon={faDownload} /></Button>
                    <Button title={t('STUDENT.SUBMISSIONS.COPY_LINK_TO_CLIPBOARD')}>
                      <FontAwesomeIcon
                        icon={faClipboard}
                        onClick={() => {
                          navigator.clipboard.writeText('a link will exist here');
                        }}
                      />
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
}
