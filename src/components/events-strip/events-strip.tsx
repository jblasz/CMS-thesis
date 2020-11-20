import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { CourseLabGroupMetaWithDates } from '../../interfaces/api';
import { getStudentDashboard } from '../../services/api/dashboard.service';
import { WarningStripComponent } from '../info/WarningStrip';
import { LoadingSpinner } from '../loading-spinner';

export function EventsStripComponent(): JSX.Element {
  const [events, setEvents] = useState<CourseLabGroupMetaWithDates[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [t] = useTranslation();
  const [hide, setHidden] = useState(false);
  const getAndSetEvents = useCallback(async () => {
    try {
      setLoading(true);
      const { upcoming: _events } = await getStudentDashboard();
      setEvents(_events);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAndSetEvents();
  }, [getAndSetEvents]);

  const activeEvents = events.filter((event) => event.startsAt.valueOf() >= new Date().valueOf());
  const upcomingEvents = events.filter((event) => event.startsAt.valueOf() < new Date().valueOf());
  if (loading) {
    return <LoadingSpinner />;
  }
  if (error) {
    return <WarningStripComponent error={error} />;
  }
  if (hide || !events.length) {
    return <></>;
  }
  return (
    <div className="alert alert-warning warning-strip">
      <div className="float-right">
        <Button
          variant="outline-danger"
          onClick={() => {
            setHidden(true);
          }}
        >
          <FontAwesomeIcon icon={faWindowClose} />
        </Button>
      </div>
      {activeEvents
        ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>
                    {t('STUDENT.DASHBOARD.ACTIVE_EVENTS')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {upcomingEvents.map((event) => (
                  <tr key={`${event.courseId}${event.groupId}${event.labId}`}>
                    <td>
                      <Link to={`/courses/${event.courseId}/laboratory/${event.labId}`}>
                        {`${event.courseName}, ${event.labName} `}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )
        : <></>}
      {upcomingEvents
        ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>
                    {t('STUDENT.DASHBOARD.UPCOMING_EVENTS')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {upcomingEvents.map((event) => (
                  <tr key={`${event.courseId}${event.groupId}${event.labId}`}>
                    <td>
                      <Link to={`/courses/${event.courseId}/laboratory/${event.labId}`}>
                        {`${event.courseName}, ${event.labName} `}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )
        : <></>}
    </div>
  );
}
