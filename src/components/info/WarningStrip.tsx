import React from 'react';
import { Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export function WarningStripComponent(props: {error: string}): JSX.Element {
  const { error } = props;
  const [t] = useTranslation();
  return (
    error ? (
      <Row className="error-strip">
        {`${t('COMMON.ERROR')}: ${error}`}
      </Row>
    ) : <></>
  );
}
