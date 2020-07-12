import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

function NavigationBar(): JSX.Element {
  const [t] = useTranslation('landing');

  return (
    <Container>
      <Navbar expand="lg" variant="light" bg="light">
        <Navbar.Brand href="#">{t('homepage')}</Navbar.Brand>
      </Navbar>
    </Container>
  );
}

export default NavigationBar;
