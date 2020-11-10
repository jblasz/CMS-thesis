import React, { useContext } from 'react';
import {
  Navbar, Nav, NavDropdown,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { faHome, faSitemap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Course, CourseLanguage } from '../../interfaces/course';
import { AuthNav } from '../auth-nav';
import { AppContext } from '../../services/contexts/app-context';

interface NavigationBarComponentProps {
  courses: Course[]
}

function NavigationBarComponent(props: NavigationBarComponentProps): JSX.Element {
  const { courses } = props;
  const [t] = useTranslation();
  const { loggedIn } = useContext(AppContext);

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
            {` ${t('NAVBAR.HOMEPAGE')}`}
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
              {` ${t('NAVBAR.DASHBOARD')}`}
            </Link>
          ) : ''}
          <Link className="nav-link" to="/code">{t('NAVBAR.CODE')}</Link>
          {loggedIn ? (
            <NavDropdown title={t('NAVBAR.ADMIN.DESCR')} id="nav-admin-dropdown">
              <NavDropdown.Item key="nav-admin-dropdown-dashboard" as="button">
                <Link className="nav-link" to="/admin">
                  {` ${t('NAVBAR.ADMIN.DASHBOARD')}`}
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item key="nav-admin-dropdown-courses" as="button">
                <Link className="nav-link" to="/admin/courses">
                  {`${t('NAVBAR.ADMIN.COURSES')}`}
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item key="nav-admin-dropdown-students" as="button">
                <Link className="nav-link" to="/admin/students">
                  {`${t('NAVBAR.ADMIN.STUDENTS')}`}
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item key="nav-admin-dropdown-resources" as="button">
                <Link className="nav-link" to="/admin/resources">
                  {`${t('NAVBAR.ADMIN.RESOURCES')}`}
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item key="nav-admin-dropdown-submissions" as="button">
                <Link className="nav-link" to="/admin/submissions">
                  {t('NAVBAR.ADMIN.SUBMISSIONS')}
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item key="nav-admin-dropdown-articles" as="button">
                <Link className="nav-link" to="/admin/articles">
                  {t('NAVBAR.ADMIN.ARTICLES')}
                </Link>
              </NavDropdown.Item>
            </NavDropdown>
          ) : ''}
        </Nav>
        <AuthNav />
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBarComponent;
