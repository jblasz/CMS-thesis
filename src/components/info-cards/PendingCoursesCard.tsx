import React, { useEffect, useState } from 'react';
import {
  Card, Col, Row, Table,
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
    <Card className="chunky-width my-2">
      <Card.Header>
        {t('PENDING.LABS.TITLE')}
      </Card.Header>
      <Card.Body>
        {error ? (
          <Row className="error-strip">
            {`${t('COMMON.ERROR')}: ${error}`}
          </Row>
        ) : ''}
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
                {t('PENDING.LABS.STARTSAT')}
              </th>
            </tr>
          </thead>
          <tbody>
            {pLabs.map((lab) => (
              <tr key={`${lab.labId} ${lab.groupId}`}>
                <td>
                  <Col>
                    <Row>
                      <Link className="nav-link py-0" to={`/admin/courses/${lab.courseId}`}>
                        {lab.courseName}
                      </Link>
                    </Row>
                    <Row>
                      <Link className="nav-link py-0" to={`/admin/courses/${lab.courseId}/laboratory/${lab.labId}`}>
                        {lab.labName}
                      </Link>
                    </Row>
                    <Row>
                      <Link className="nav-link py-0" to={`/admin/courses/${lab.courseId}/group/${lab.groupId}`}>
                        {lab.groupName}
                      </Link>
                    </Row>

                  </Col>
                </td>
                <td>
                  <Col>
                    <Row>
                      {formatDate(lab.startsAt, true)}
                    </Row>
                    <Row>
                      {formatDate(lab.endsAt, true)}
                    </Row>
                  </Col>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
