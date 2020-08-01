import React, { useState } from 'react';
import {
  Navbar, Nav, Form, Button, FormLabel, NavDropdown
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { faHome, faSitemap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Course, CourseLanguage } from '../../interfaces/course';

interface NavigationBarComponentProps {
  courses: Course[]
}

function NavigationBarComponent(props: NavigationBarComponentProps): JSX.Element {
  const { courses } = props;
  const [t] = useTranslation();
  const [loggedIn, login] = useState(false);
  return (
    <Navbar bg="light" variant="light" expand="lg" fixed="top" collapseOnSelect>
      <Navbar.Brand href="/">{t('WEBSITE_NAME')}</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Link className="nav-link" to="/">
            <FontAwesomeIcon icon={faHome} className="mr-1" />
            {' '}
            {t('NAVBAR.HOMEPAGE')}
          </Link>

          <NavDropdown title={t('NAVBAR.COURSES')} id="basic-nav-dropdown">
            <NavDropdown.Item key="all-courses" as="button">
              <Link className="nav-link" to="/courses">
                {t('NAVBAR.ALL_COURSES')}
              </Link>
            </NavDropdown.Item>
            <NavDropdown.Item disabled>{t('NAVBAR.COURSES_PL')}</NavDropdown.Item>
            <NavDropdown.Divider />
            {courses.filter((course) => course.language === CourseLanguage.PL).map((course) => (
              <NavDropdown.Item key={course._id} as="button">
                <Link className="nav-link" to={`/courses/${course._id}`}>
                  {course.name}
                </Link>
              </NavDropdown.Item>
            ))}
            <NavDropdown.Item disabled>{t('NAVBAR.COURSES_EN')}</NavDropdown.Item>
            <NavDropdown.Divider />
            {courses.filter((course) => course.language === CourseLanguage.EN).map((course) => (
              <NavDropdown.Item key={course._id} as="button">
                <Link className="nav-link" to={`/courses/${course._id}`}>
                  {course.name}
                </Link>
              </NavDropdown.Item>
            ))}
          </NavDropdown>
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
