import React, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import {
  Card, Col, Container, Row, Table,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IPendingLaboratory } from '../../interfaces/misc';
import { Role } from '../../interfaces/user';
import { getDashboardLaboratories, getStudentDashboard } from '../../services/api/dashboard.service';
import { AppContext } from '../../services/contexts/app-context';
import { formatDate } from '../../utils';
import { WarningStripComponent } from '../info/WarningStrip';
import { LoadingSpinner } from '../loading-spinner';

export function PendingCoursesComponent(): JSX.Element {
  const { user } = useContext(AppContext);
  const admin = user && user.role && user.role === Role.ADMIN;
  const [pLabs, setPLabs] = useState<IPendingLaboratory[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [t] = useTranslation();
  const getAndSetCourses = useCallback(async () => {
    try {
      if (!user || !user.student) {
        return;
      }
      setLoading(true);
      if (admin) {
        const ret = await getDashboardLaboratories((user && user.student && user.student._id) || '');
        setPLabs(ret.laboratories);
      } else {
        const ret = await getStudentDashboard(user.student._id);
        setPLabs(ret.upcoming);
      }
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [admin, user]);
  useEffect(() => {
    getAndSetCourses();
  }, [getAndSetCourses]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <WarningStripComponent error={error} />;
  }

  return (
    <Container className="box-wrapper">
      <div className="box">
        <div className="box-inner">
          <Card.Subtitle className="mb-2">
            <i>{t('PENDING.LABS.TIMERANGE')}</i>
          </Card.Subtitle>
          <Table className="table-sm">
            <thead>
              <tr>
                <th>
                  <p>{t('PENDING.LABS.COURSENAME')}</p>
                </th>
                <th>
                  <p>{t('PENDING.LABS.STARTSAT')}</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {pLabs.map((lab) => (
                <tr key={`${lab.labId} ${lab.groupId}`}>
                  <td>
                    <Col>
                      <Row>
                        <Link className="nav-link py-0" to={admin ? `/admin/courses/${lab.courseId}` : `/courses/${lab.courseId}`}>
                          {lab.courseName}
                        </Link>
                      </Row>
                      <Row>
                        <Link className="nav-link py-0" to={admin ? `/admin/courses/${lab.courseId}/laboratory/${lab.labId}` : `/courses/${lab.courseId}/laboratory/${lab.labId}`}>
                          {lab.labName}
                        </Link>
                      </Row>
                      <Row>
                        <Link className="nav-link py-0" to={admin ? `/admin/courses/${lab.courseId}/group/${lab.groupId}` : `/courses/${lab.courseId}/laboratory/${lab.labId}`}>
                          {lab.groupName}
                        </Link>
                      </Row>

                    </Col>
                  </td>
                  <td>
                    <Col>
                      <Row>
                        {formatDate(lab.dateFrom, true)}
                      </Row>
                      <Row>
                        {formatDate(lab.dateTo, true)}
                      </Row>
                    </Col>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </Container>
  );
}
