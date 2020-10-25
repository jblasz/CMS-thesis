import React, { useEffect, useState } from 'react';
import {
  Card, Row, Table,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PendingLaboratory } from '../../interfaces/api';
import { getDashboardLaboratories } from '../../services/api/dashboard.service';
import { formatDate } from '../../utils';
import { LoadingSpinner } from '../loading-spinner';

export function PendingCoursesCard(): JSX.Element {
  const [pLabs, setPLabs] = useState<PendingLaboratory[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [t] = useTranslation();
  const getAndSetPCourses = async () => {
    try {
      setLoading(true);
      const ret = await getDashboardLaboratories(7);
      setPLabs(ret.laboratories);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAndSetPCourses();
  }, []);
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <Card>
      <Card.Body>
        {error ? (
          <Row className="error-strip">
            {`${t('COMMON.ERROR')}: ${error}`}
          </Row>
        ) : ''}
        <Card.Title>
          {t('PENDING.LABS.TITLE')}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {t('PENDING.LABS.TIMERANGE')}
        </Card.Subtitle>
        <Table className="table-sm">
          <thead>
            <tr>
              <th>
                {t('PENDING.LABS.COURSENAME')}
              </th>
              <th>
                {t('PENDING.LABS.LABNAME')}
              </th>
              <th>
                {t('PENDING.LABS.GROUPNAME')}
              </th>
              <th>
                {t('PENDING.LABS.STARTSAT')}
              </th>
              <th>
                {t('PENDING.LABS.ENDSAT')}
              </th>
            </tr>
          </thead>
          <tbody>
            {pLabs.map((lab) => (
              <tr key={`${lab.labId} ${lab.groupId}`}>
                <td>
                  <Link className="nav-link" to={`/admin/courses/${lab.courseId}`}>
                    {lab.courseName}
                  </Link>
                </td>
                <td>
                  <Link className="nav-link" to={`/admin/courses/${lab.courseId}/laboratory/${lab.labId}`}>
                    {lab.labName}
                  </Link>
                </td>
                <td>
                  <Link className="nav-link" to={`/admin/courses/${lab.courseId}/group/${lab.groupId}`}>
                    {lab.groupName}
                  </Link>
                </td>
                <td>
                  {formatDate(lab.startsAt)}
                </td>
                <td>
                  {formatDate(lab.endsAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
