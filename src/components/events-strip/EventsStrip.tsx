/* eslint-disable no-underscore-dangle */
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import {
  Button,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getStudentDashboard } from '../../services/api/dashboard.service';
import { WarningStripComponent } from '../info/WarningStrip';
import { LoadingSpinner } from '../loading-spinner';
import { AppContext } from '../../services/contexts/app-context';
import { Role } from '../../interfaces/user';
import { ICourseLabGroupMetaWithDates } from '../../interfaces/misc';

export function EventsStripComponent(): JSX.Element {
  const [{ events, activeEvents, upcomingEvents }, setEvents] = useState<{
    events: ICourseLabGroupMetaWithDates[],
    activeEvents: ICourseLabGroupMetaWithDates[],
    upcomingEvents: ICourseLabGroupMetaWithDates[]
  }>({
    events: [],
    activeEvents: [],
    upcomingEvents: [],
  });
  const { user } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [t] = useTranslation();
  const [hide, setHidden] = useState(false);

  const getAndSetEvents = useCallback(async () => {
    try {
      if (!user || !user.student || user.role !== Role.STUDENT) {
        return;
      }
      setLoading(true);
      const { upcoming: _events } = await getStudentDashboard(user.student._id);
      const now = new Date();
      const highRange = new Date(now.valueOf() + 31 * 24 * 60 * 60 * 1000);

      const _activeEvents: ICourseLabGroupMetaWithDates[] = [];
      const _upcomingEvents: ICourseLabGroupMetaWithDates[] = [];
      _events.forEach(
        (event) => {
          if (event.dateFrom.valueOf() < now.valueOf() && event.dateTo.valueOf() > now.valueOf()) {
            _activeEvents.push(event);
          } else if (event.dateFrom.valueOf() > now.valueOf()
          && event.dateFrom.valueOf() <= highRange.valueOf()) {
            _upcomingEvents.push(event);
          }
        },
      );

      setEvents({
        events: _events,
        activeEvents: _activeEvents,
        upcomingEvents: _upcomingEvents,
      });
    } catch (e) {
      setError(`Events strip: ${e}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    getAndSetEvents();
  }, [getAndSetEvents]);

  if (!user || user.role === Role.ADMIN) {
    return <></>;
  }
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
      {activeEvents.length
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
                {activeEvents.map((event) => (
                  <tr key={`${event.courseId}${event.groupId}${event.labId}`}>
                    <td>
                      <Link to={`/dashboard?focus=${event.courseId}`}>
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
      {upcomingEvents.length
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
                      <Link to={`/dashboard?focus=${event.courseId}`}>
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
