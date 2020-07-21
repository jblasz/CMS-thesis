import React, { useState } from 'react';
import {
  Navbar, Nav, Form, Button, FormLabel,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { faHome, faSitemap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

function NavigationBarComponent(): JSX.Element {
  const [t] = useTranslation();

  const [loggedIn, login] = useState(false);

  return (
    <Navbar bg="light" expand="lg" sticky="top">
      <Navbar.Brand href="/">{t('WEBSITE_NAME')}</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Link className="nav-link" to="/">
            <FontAwesomeIcon icon={faHome} className="mr-1" />
            {' '}
            {t('NAVBAR.HOMEPAGE')}
          </Link>
          {loggedIn ? (
            <Link className="nav-link" to="/dashboard">
              <FontAwesomeIcon icon={faSitemap} />
              {' '}
              {t('NAVBAR.DASHBOARD')}
            </Link>
          ) : ''}
          <Link className="nav-link" to="/login">{t('NAVBAR.LOGIN')}</Link>
          <Link className="nav-link" to="/register">{t('NAVBAR.REGISTER')}</Link>
          <Link className="nav-link" to="/courses">{t('NAVBAR.COURSES')}</Link>
          <Link className="nav-link" to="/articles">{t('NAVBAR.ARTICLES')}</Link>
          <Link className="nav-link" to="/research">{t('NAVBAR.RESEARCH')}</Link>
        </Nav>
        <Form>
          <FormLabel className="mr-2">
            <h6>
              {loggedIn ? `${t('login.loggedIn')} Mr Fox` : t('login.notLoggedIn')}
            </h6>
          </FormLabel>
          <Button onClick={() => login(!loggedIn)}>{!loggedIn ? t('login.login') : t('login.logout')}</Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBarComponent;
