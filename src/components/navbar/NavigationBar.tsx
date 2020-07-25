import React, { useState } from 'react';
import {
  Navbar, Nav, Form, Button, FormLabel, Dropdown, ButtonGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { faHome, faSitemap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Course } from '../../interfaces/course';

interface NavigationBarComponentProps {
  courses: Course[]
}

function NavigationBarComponent(props: NavigationBarComponentProps): JSX.Element {
  const { courses } = props;

  console.log(courses);

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
          <Dropdown as={ButtonGroup}>
            <Button variant="info">{t('NAVBAR.COURSES')}</Button>
            <Dropdown.Toggle split variant="success" id="dropdown-split-toggle" />
            <Dropdown.Menu>
              <Dropdown.Item disabled>{t('NAVBAR.COURSES_PL')}</Dropdown.Item>
              <Dropdown.Divider />
              {courses.filter((course) => course.language === 'pl').map((course) => (
                <Dropdown.Item key={course._id} as="button">
                  <Link className="nav-link" to={`/courses/${course._id}`}>
                    {course.name}
                  </Link>
                </Dropdown.Item>
              ))}
              <Dropdown.Item disabled>{t('NAVBAR.COURSES_EN')}</Dropdown.Item>
              <Dropdown.Divider />
              {courses.filter((course) => course.language === 'en').map((course) => (
                <Dropdown.Item key={course._id} as="button">
                  <Link className="nav-link" to={`/courses/${course._id}`}>
                    {course.name}
                  </Link>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Link className="nav-link" to="/articles">{t('NAVBAR.ARTICLES')}</Link>
          <Link className="nav-link" to="/research">{t('NAVBAR.RESEARCH')}</Link>
          {loggedIn ? (
            <Link className="nav-link" to="/dashboard">
              <FontAwesomeIcon icon={faSitemap} />
              {' '}
              {t('NAVBAR.DASHBOARD')}
            </Link>
          ) : ''}
        </Nav>
        <Form>
          <FormLabel className="mr-2">
            <h6>
              {loggedIn ? `${t('LOGIN.WELCOME')}, Mr Fox` : t('LOGIN.NOT_LOGGED_IN')}
            </h6>
          </FormLabel>
          <Button onClick={() => login(!loggedIn)}>{!loggedIn ? t('LOGIN.LOGIN') : t('LOGIN.LOGOUT')}</Button>
          <Link to="/register">{t('NAVBAR.REGISTER')}</Link>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBarComponent;
