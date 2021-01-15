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
import { config } from '../../config';
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
  const [hide, setHidden] = useState(config.hideWarningStrip);
  let isMounted = true;

  const getAndSetEvents = useCallback(async () => {
    try {
      setLoading(true);
      const { upcoming: _events } = await getStudentDashboard();
      const _activeEvents = _events.filter(
        (event) => event.startsAt.valueOf() >= new Date().valueOf(),
      );
      const _upcomingEvents = _events.filter(
        (event) => event.startsAt.valueOf() < new Date().valueOf(),
      );
      if (isMounted) {
        setEvents({
          events: _events,
          activeEvents: _activeEvents,
          upcomingEvents: _upcomingEvents,
        });
      }
    } catch (e) {
      if (isMounted) {
        setError(`Events strip: ${e}`);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  }, [isMounted]);

  useEffect(() => {
    getAndSetEvents();
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isMounted = false;
    };
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
                      <Link to={`/dashboard?focus=${event.courseId}baf`}>
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
