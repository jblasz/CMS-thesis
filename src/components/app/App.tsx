import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import CookieConsent from 'react-cookie-consent';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import { Route, useHistory } from 'react-router-dom';
import Switch from 'react-bootstrap/esm/Switch';
import { NavigationBarComponent } from '../navbar';
import { LoginComponent } from '../login';
import { RegisterComponent } from '../register';
import { ResearchComponent } from '../research';
import { ArticlesComponent } from '../articles';
import { FooterComponent } from '../footer';
import { Course } from '../../interfaces/course';
import { Component404 } from '../404';
import { CourseListComponent } from '../courseList';
import { CourseComponent } from '../course';
import { LaboratoryComponent } from '../laboratory';
import { PrivateRoute } from '../private-route';
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

function App():JSX.Element {
  const [courses, setCourses] = useState<Course[]>([]);
  const [articles, setArticles] = useState<IArticleMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<IUser | null>(process.env.REACT_APP_START_LOGGED_IN ? {
    role: Role.ADMIN,
    student: {
      _id: '', email: '', name: '', usosId: '', registeredAt: new Date(), contactEmail: '',
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
      console.error('error?', e);
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
      if (error.response.status === 401) {
        setUser(null);
        history.push('/');
      }
      return Promise.reject(error);
    });

  useEffect(() => { getAndSetCourses(); }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      <AppContext.Provider value={{
        user, setUser,
      }}
      >
        <header />
        <main>
          <div className="main">
            <NavigationBarComponent courses={courses} articles={articles} />
            <EventsStripComponent />
            <Switch>
              <Route
                exact
                path="/"
                component={() => (
                  <CourseListComponent courses={courses} />
                )}
              />
              <Route exact path="/login" component={LoginComponent} />
              <Route exact path="/register" component={RegisterComponent} />
              <Route exact path="/courses/:id/laboratory/:labID" component={LaboratoryComponent} />
              <Route exact path="/courses/:id" component={CourseComponent} />
              <Route exact path="/courses" component={() => <CourseListComponent courses={courses} />} />
              <Route exact path="/research" component={ResearchComponent} />
              <Route exact path="/articles/:id" component={ArticlesComponent} />
              <Route exact path="/code" component={CodeValidationComponent} />
              <PrivateRoute exact path="/dashboard" component={StudentDashboardComponent} />
              <PrivateRoute exact path="/profile" component={ProfileComponent} />
              <PrivateRoute exact path="/admin" component={AdminPanelComponent} />
              <PrivateRoute exact path="/admin/resources" component={AdminResourcesComponent} />
              <PrivateRoute exact path="/admin/students" component={AdminStudentsComponent} />
              <PrivateRoute exact path="/admin/students/:id" component={AdminStudentComponent} />
              <PrivateRoute exact path="/admin/courses" component={AdminCoursesComponent} />
              <PrivateRoute exact path="/admin/courses/:id" component={AdminCourseComponent} />
              <PrivateRoute exact path="/admin/courses/:courseID/group/:groupID" component={AdminCourseGroupComponent} />
              <PrivateRoute exact path="/admin/courses/:courseID/laboratory/:labID" component={AdminCourseLaboratoryComponent} />
              <PrivateRoute exact path="/admin/submissions" component={AdminSubmissionsComponent} />
              <PrivateRoute exact path="/admin/articles" component={AdminArticlesComponent} />
              <PrivateRoute exact path="/admin/articles/:id" component={AdminArticleComponent} />
              <Route exact path="/404" component={Component404} />
            </Switch>
          </div>
          <FooterComponent />
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
