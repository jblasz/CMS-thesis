import React, { useCallback, useEffect, useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Code } from '../../interfaces/code';
import { getCodes } from '../../services/api/codes.service';
import { WarningStripComponent } from '../info/WarningStrip';
import { LoadingSpinner } from '../loading-spinner';
import { AdminCodesListComponent } from '../admin-codes/AdminCodesList';

export function AdminCodesCardComponent(): JSX.Element {
  const [t] = useTranslation();
  const [codes, setCodes] = useState<Code[]>([]);
  const [showInactive, setShowInactive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const grabCodes = useCallback(async () => {
    try {
      setLoading(true);
      const { codes: _codes } = await getCodes(showInactive);
      setCodes(_codes);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [showInactive]);
  useEffect(() => {
    grabCodes();
  }, [grabCodes]);

  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <Card className="chunky-width my-2">
      <Card.Header>
        {t('ADMIN.CODES.DESCR')}
      </Card.Header>
      <WarningStripComponent error={error} />
      <Card.Body>
        <Form>
          <Form.Group controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              label={t('ADMIN.CODES.SHOW_INACTIVE')}
              checked={showInactive}
              onChange={() => {
                setShowInactive(!showInactive);
              }}
            />
          </Form.Group>
        </Form>
        <AdminCodesListComponent codes={codes} />
      </Card.Body>
    </Card>
  );
}
