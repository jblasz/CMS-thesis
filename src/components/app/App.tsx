import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import CookieConsent from 'react-cookie-consent';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import {
  Redirect, Route, useHistory, Switch,
} from 'react-router-dom';
import { NavigationBarComponent } from '../navbar';
import { ResearchComponent } from '../research';
import { ArticlesComponent } from '../articles';
import { FooterComponent } from '../footer';
import { Course } from '../../interfaces/course';
import { Component404 } from '../404';
import { CourseListComponent } from '../courseList';
import { CourseComponent } from '../course';
import { LaboratoryComponent } from '../laboratory';
import { ProfileComponent } from '../profile';
import { AdminPanelComponent } from '../admin-panel/AdminPanel';
import { AdminCoursesComponent } from '../admin-courses';
import { AdminCourseComponent } from '../admin-course';
import { AdminStudentsComponent } from '../admin-students';
import { AdminStudentComponent } from '../admin-student';
import { AdminCourseGroupComponent } from '../admin-course-group';
import { CodeValidationComponent } from '../code-validation';
import { AdminCourseLaboratoryComponent } from '../admin-course-laboratory';
import { AdminResourcesComponent } from '../admin-resources';
import { AdminSubmissionsComponent } from '../admin-submissions';
import { AppContext } from '../../services/contexts/app-context';
import { AdminArticlesComponent } from '../admin-articles/AdminArticles';
import { AdminArticleComponent } from '../admin-articles/AdminArticle';
import { EventsStripComponent } from '../events-strip/EventsStrip';
import { StudentDashboardComponent } from '../student-dashboard/StudentDashboard';
import { getArticles } from '../../services/api/articles.service';
import { IArticleMeta } from '../../interfaces/article';
import { LoadingSpinner } from '../loading-spinner';
import { IGetArticlesResponse } from '../../interfaces/api';
import { IUser, Role } from '../../interfaces/user';
import { axiosInstance } from '../../services/api/request.service';
import { getPublicCourses } from '../../services/api/courses.service';
import ScrollToTop from './ScrollToTop';
import { AdminLandingPageComponent } from '../admin-landing-page/AdminLandingPage';

function App():JSX.Element {
  const [courses, setCourses] = useState<Course[]>([]);
  const [articles, setArticles] = useState<IArticleMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<IUser | null>(process.env.REACT_APP_START_LOGGED_IN ? {
    role: Role.ADMIN,
    student: {
      _id: 'mock-id', email: 'mock-email', name: 'mock-name', usosId: 'mock-id', registeredAt: new Date(), contactEmail: '',
    },
  } : null);
  const [, setError] = useState('');
  const [t] = useTranslation();
  const [, setCookie] = useCookies();
  const history = useHistory();

  const getAndSetCourses = async () => {
    try {
      setLoading(true);
      const [
        { courses: _courses }, { articles: _articles },
      ] = await Promise.all([
        getPublicCourses(),
        getArticles().catch(() => ({ articles: [] } as IGetArticlesResponse)),
      ]);
      setCourses(_courses.map((x) => new Course(x)));
      setArticles(_articles);
    } catch (e) {
      console.error('getAndSetCourses() error', e);
      setError(`GetAndSetCourse() ${e}`);
    } finally {
      setLoading(false);
    }
  };

  axiosInstance.interceptors.request.use((config) => {
    const cookie = Cookies.get('authorization');
    if (cookie && !config.headers.authorization) {
      config.headers.authorization = cookie;
    }
    return config;
  },
  (error) => error);
  axiosInstance.interceptors.response.use((response) => response,
    (error) => {
      if (error && error.response && error.response.status === 401) {
        Cookies.remove('authorization');
        setUser(null);
        history.push('/');
      }
      return Promise.reject(error);
    });

  useEffect(() => {
    getAndSetCourses();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  function wrap404(component: () => JSX.Element, asAdmin = true): () => JSX.Element {
    if (!user || (asAdmin && user.role !== Role.ADMIN)) {
      return Component404;
    }
    return component;
  }

  return (
    <div className="App">
      <AppContext.Provider value={{
        user, setUser,
      }}
      >
        <header>
          <NavigationBarComponent courses={courses} articles={articles} />

        </header>
        <main>
          <div className="main">
            <ScrollToTop />
            { user && (user as IUser).role === Role.STUDENT ? <EventsStripComponent /> : <></> }
            <Switch>
              <Route path="/" exact component={() => (<CourseListComponent courses={courses} />)} />
              <Route exact path="/courses/:id/laboratory/:labID" component={LaboratoryComponent} />
              <Route exact path="/courses/:id" component={CourseComponent} />
              <Route exact path="/courses" component={() => <CourseListComponent courses={courses} />} />
              <Route exact path="/research" component={ResearchComponent} />
              <Route exact path="/articles/:id" component={ArticlesComponent} />
              <Route exact path="/code" component={CodeValidationComponent} />
              <Route exact path="/profile" component={wrap404(ProfileComponent, false)} />
              <Route exact path="/dashboard" component={wrap404(StudentDashboardComponent, false)} />
              <Route exact path="/admin" component={wrap404(AdminPanelComponent)} />
              <Route exact path="/admin/resources" component={wrap404(AdminResourcesComponent)} />
              <Route exact path="/admin/students" component={wrap404(AdminStudentsComponent)} />
              <Route exact path="/admin/students/:id" component={wrap404(AdminStudentComponent)} />
              <Route exact path="/admin/courses" component={wrap404(AdminCoursesComponent)} />
              <Route exact path="/admin/courses/:id" component={wrap404(AdminCourseComponent)} />
              <Route exact path="/admin/courses/:courseID/group/:groupID" component={wrap404(AdminCourseGroupComponent)} />
              <Route exact path="/admin/courses/:courseID/laboratory/:labID" component={wrap404(AdminCourseLaboratoryComponent)} />
              <Route exact path="/admin/submissions" component={wrap404(AdminSubmissionsComponent)} />
              <Route exact path="/admin/articles" component={wrap404(AdminArticlesComponent)} />
              <Route exact path="/admin/articles/:id" component={wrap404(AdminArticleComponent)} />
              <Route exact path="/admin/landingPage" component={wrap404(AdminLandingPageComponent)} />
              <Route path="/404" component={Component404} />
              <Redirect to="/404" />
            </Switch>
          </div>
          <FooterComponent onRefresh={() => getAndSetCourses()} />
          <CookieConsent
            location="bottom"
            buttonText={t('MAIN.COOKIE_CONSENT_ACCEPT')}
            setDeclineCookie={false}
            overlayClasses="cookie-consent-overlay"
            containerClasses="cookie-consent-container"
            overlay
            onAccept={() => {
              // setting it again by hook to trigger useCookie hook elsewhere in the app
              setCookie('CookieConsent', 'true');
            }}
          >
            {t('MAIN.COOKIE_CONSENT')}
          </CookieConsent>
        </main>

      </AppContext.Provider>
    </div>
  );
}

export default App;
