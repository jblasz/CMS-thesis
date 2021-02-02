import React, { useContext } from 'react';
import {
  Button,
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
import { Role } from '../../interfaces/user';
import { appEnv } from '../../appEnv';

interface NavigationBarComponentProps {
  courses: Course[]
  articles: IArticleMeta[]
}

function NavigationBarComponent(props: NavigationBarComponentProps): JSX.Element {
  const { courses: _courses, articles } = props;
  const [t, { language }] = useTranslation();
  const { user, setUser } = useContext(AppContext);

  const courses = _courses.filter((course) => course.active);

  const articleGroupings = articles.reduce(
    (agg: {
      singletons: {[key:string]:{_id: string, weight: number}},
      compound: {[key:string]:{_id: string, categoryMinor: string, weight: number}[]}}, curr) => {
      const l = language === 'en' ? curr.en : curr.pl;
      if (!l.categoryMajor) {
        return agg;
      }
      if (!l.categoryMinor) {
        agg.singletons[l.categoryMajor] = { _id: curr._id, weight: curr.sortWeight };
      } else {
        if (!agg.compound[l.categoryMajor]) {
          agg.compound[l.categoryMajor] = [];
        }
        agg.compound[l.categoryMajor].push(
          { _id: curr._id, categoryMinor: l.categoryMinor, weight: curr.sortWeight },
        );
      }
      return agg;
    }, { singletons: {}, compound: {} },
  );

  const articlesToRender = [
    {
      component: (
        <NavDropdown key="navbar-courses" title={t('NAVBAR.COURSES')} id="basic-nav-dropdown">
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
      ),
      weight: -3,
    },
    ...(user && user.role === Role.STUDENT ? [{
      component: (
        <Link key="navbar-student-dashboard" className="nav-link" to="/dashboard">
          <FontAwesomeIcon icon={faSitemap} />
          {` ${t('NAVBAR.DASHBOARD')}`}
        </Link>
      ),
      weight: -2,
    }] : []),
    {
      component: (<Link key="navbar-code-link" className="nav-link" to="/code">{t('NAVBAR.CODE')}</Link>),
      weight: -1,
    },
    ...Object.keys(articleGroupings.singletons).map((categoryMajor) => {
      const article = articleGroupings.singletons[categoryMajor];
      return {
        component: <Link key={article._id} className="nav-link" to={`/articles/${article._id}`}>{categoryMajor}</Link>,
        weight: article.weight,
      };
    }),
    ...Object.keys(articleGroupings.compound).map((categoryMajor) => {
      // sort in-place by weight
      articleGroupings.compound[categoryMajor].sort((a, b) => a.weight - b.weight);
      // set overall weight
      const overallWeight = articleGroupings.compound[categoryMajor][0].weight;
      return {
        component: (
          <NavDropdown key={categoryMajor} title={categoryMajor} id={categoryMajor}>
            {articleGroupings.compound[categoryMajor].map((x) => (
              <NavDropdown.Item key={x._id} as="button">
                <Link className="nav-link" to={`/articles/${x._id}`}>
                  {x.categoryMinor}
                </Link>
              </NavDropdown.Item>
            ))}
          </NavDropdown>
        ),
        weight: overallWeight,
      };
    }),
  ].sort((a, b) => a.weight - b.weight);

  return (
    <Navbar className="nav" expand="lg" fixed="top">
      <Navbar.Brand className="nav-brand">
        <Link to="/" className="nav-link">
          {t('WEBSITE_NAME')}
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto nav-items">
          <>
            {articlesToRender.map((x) => x.component)}
          </>
          {user && user.role === Role.ADMIN ? (
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
              <NavDropdown.Item key="nav-admin-dropdown-landingpage" as="button">
                <Link className="nav-link" to="/admin/landingPage">
                  {t('NAVBAR.ADMIN.LANDING_PAGE')}
                </Link>
              </NavDropdown.Item>
            </NavDropdown>
          ) : <></>}
          { appEnv().useMocks && user ? (
            <Button
              className="nav-link"
              style={{ opacity: 0.5, borderWidth: 0 }}
              onClick={() => {
                if (user) {
                  user.role = user.role === Role.ADMIN ? Role.STUDENT : Role.ADMIN;
                  setUser({ ...user });
                }
              }}
            >
              Toggle role
            </Button>
          ) : <></> }
        </Nav>
        <AuthNav />
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBarComponent;
