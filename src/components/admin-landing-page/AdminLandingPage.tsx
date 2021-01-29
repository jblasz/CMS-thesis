import React, { useCallback, useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { getLandingPage, putLandingPage } from '../../services/api/dashboard.service';
import { EditorComponent } from '../editor/Editor';
import { WarningStripComponent } from '../info/WarningStrip';
import { LoadingSpinner } from '../loading-spinner';

export function AdminLandingPageComponent(): JSX.Element {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [landingPage, setLandingPage] = useState('');
  const [t] = useTranslation();

  const getAndSetLandingPage = useCallback(async () => {
    try {
      setLoading(true);
      const { landingPage: _landingPage } = await getLandingPage();
      setLandingPage(_landingPage);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAndSetLandingPage();
  }, [getAndSetLandingPage]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <WarningStripComponent error={error} />;
  }

  return (
    <Container className="my-2">
      <div className="my-2 row justify-content-between">
        {t('ADMIN.LANDING_PAGE.DESCR')}
        <Button onClick={async () => {
          try {
            setLoading(true);
            await putLandingPage(landingPage);
            await getAndSetLandingPage();
          } catch (e) {
            setError(e);
          } finally {
            setLoading(false);
          }
        }}
        >
          {t('ADMIN.LANDING_PAGE.SUBMIT')}
        </Button>
      </div>
      <EditorComponent
        text={landingPage}
        setText={(text) => {
          setLandingPage(text);
        }}
      />
    </Container>
  );
}
