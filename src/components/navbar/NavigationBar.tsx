import React from 'react';
import {
  Navbar, Nav, NavDropdown,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { faHome, faSitemap, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Course, CourseLanguage } from '../../interfaces/course';
import { AuthNav } from '../auth-nav';

interface NavigationBarComponentProps {
  courses: Course[]
}

function NavigationBarComponent(props: NavigationBarComponentProps): JSX.Element {
  const { courses } = props;
  const [t] = useTranslation();
  const { isAuthenticated } = useAuth0();

  console.log(useAuth0());
  return (
    <Navbar bg="light" variant="light" expand="lg" fixed="top" collapseOnSelect>
      <Link to="/">
        {' '}
        <Navbar.Brand>
          {t('WEBSITE_NAME')}
        </Navbar.Brand>
      </Link>

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
          {isAuthenticated ? (
            <Link className="nav-link" to="/dashboard">
              <FontAwesomeIcon icon={faSitemap} />
              {' '}
              {t('NAVBAR.DASHBOARD')}
            </Link>
          ) : ''}
          {isAuthenticated ? (
            <Link className="nav-link" to="/admin">
              <FontAwesomeIcon icon={faUserCog} />
              {' '}
              {t('NAVBAR.ADMIN')}
            </Link>
          ) : ''}
        </Nav>
        <AuthNav />
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBarComponent;
