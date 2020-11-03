import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { getAdminDashboard } from '../../services/api/dashboard.service';
import { LoadingSpinner } from '../loading-spinner';

export function AdminSummaryCard(): JSX.Element {
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unmarkedCount, setUnmarkedCount] = useState(-1);

  const getAndSetAdminDashboard = async () => {
    try {
      setLoading(true);
      const { unmarkedSolutionsCount } = await getAdminDashboard();
      setUnmarkedCount(unmarkedSolutionsCount);
      setLoading(false);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAndSetAdminDashboard();
  }, []);
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <Card>
      <Card.Header>
        {t('ADMIN.SUMMARY.SUMMARY')}
      </Card.Header>
      <Card.Body>
        {error ? (
          <Row className="error-strip">
            {`${t('COMMON.ERROR')}: ${error}`}
          </Row>
        ) : ''}
        <Col>
          {`${t('ADMIN.SUMMARY.UNMARKED_COUNT')}: ${unmarkedCount}`}
        </Col>
      </Card.Body>
    </Card>
  );
}