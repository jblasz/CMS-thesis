import React, { useContext } from 'react';
import {
  Nav,
  Navbar,
  NavDropdown,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { faSitemap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Course, CourseLanguage } from '../../interfaces/course';
import { AuthNav } from '../auth-nav';
import { AppContext } from '../../services/contexts/app-context';
import { IArticleMeta } from '../../interfaces/article';
import './NavigationBar.scss';

interface NavigationBarComponentProps {
  courses: Course[]
  articles: IArticleMeta[]
}

function NavigationBarComponent(props: NavigationBarComponentProps): JSX.Element {
  const { courses: _courses, articles } = props;
  const [t, { language }] = useTranslation();
  const { loggedIn } = useContext(AppContext);

  const courses = _courses.filter((course) => course.active);

  const articleGroupings = articles.reduce(
    (agg: {[key:string]:{_id: string, categoryMinor: string}[]}, curr) => {
      const l = language === 'en' ? curr.en : curr.pl;
      if (!agg[l.categoryMajor]) {
        agg[l.categoryMajor] = [];
      }
      agg[l.categoryMajor].push({ _id: curr._id, categoryMinor: l.categoryMinor });
      return agg;
    }, {},
  );

  return (
    <Navbar className="nav" expand="lg" fixed="top">
      <Navbar.Brand className="nav-brand">
        <Link to="/" className="nav-link text-gray">
          {t('WEBSITE_NAME')}
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto nav-items">
          <NavDropdown title={t('NAVBAR.COURSES')} id="basic-nav-dropdown">
            <NavDropdown.Item className="category" disabled>{t('NAVBAR.COURSES_PL')}</NavDropdown.Item>
            <NavDropdown.Divider />
            {courses.filter((course) => course.language === CourseLanguage.PL).map((course) => (
              <NavDropdown.Item key={course._id} as="button">
                <Link className="nav-link" to={`/courses/${course._id}`}>
                  {course.name}
                </Link>
              </NavDropdown.Item>
            ))}
            <NavDropdown.Item className="category" disabled>{t('NAVBAR.COURSES_EN')}</NavDropdown.Item>
            <NavDropdown.Divider />
            {courses.filter((course) => course.language === CourseLanguage.EN).map((course) => (
              <NavDropdown.Item key={course._id} as="button">
                <Link className="nav-link" to={`/courses/${course._id}`}>
                  {course.name}
                </Link>
              </NavDropdown.Item>
            ))}
          </NavDropdown>
          <>
            {Object.keys(articleGroupings).map((categoryMajor) => (
              <NavDropdown key={categoryMajor} title={categoryMajor} id={categoryMajor}>
                {articleGroupings[categoryMajor].map((x) => (
                  <NavDropdown.Item key={x._id} as="button">
                    <Link className="nav-link" to={`/articles/${x._id}`}>
                      {x.categoryMinor}
                    </Link>
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            ))}
          </>
          {loggedIn ? (
            <Link className="nav-link" to="/dashboard">
              <FontAwesomeIcon icon={faSitemap} />
              {` ${t('NAVBAR.DASHBOARD')}`}
            </Link>
          ) : <></>}
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
          ) : <></>}
        </Nav>
        <AuthNav />
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBarComponent;
