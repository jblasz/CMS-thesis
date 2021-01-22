import { Container, Jumbotron } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { Link } from 'react-router-dom';

function Component404(): JSX.Element {
  const [t] = useTranslation();
  return (
    <Container>
      <Jumbotron className="justify-content-center">
        <h1 className="text-danger">{t('404.404')}</h1>
        <p>{t('404.DOES_NOT_EXIST')}</p>
        <Link className="nav-link" to="/">{t('404.GO_BACK')}</Link>
      </Jumbotron>
    </Container>
  );
}

export default Component404;
