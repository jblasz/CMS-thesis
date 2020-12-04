import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import Switch from 'react-bootstrap/esm/Switch';
import { NavigationBarComponent } from '../navbar';
import { LoginComponent } from '../login';
import { RegisterComponent } from '../register';
import { ResearchComponent } from '../research';
import { ArticlesComponent } from '../articles';
import { FooterComponent } from '../footer';
import { getCourses } from '../../services/api/courses.service';
import { Course } from '../../interfaces/course';
import { Component404 } from '../404';
import { CourseListComponent } from '../courseList';
import { CourseComponent } from '../course';
import { LaboratoryComponent } from '../laboratory';
import './App.scss';
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
import { EventsStripComponent } from '../events-strip/events-strip';
import { StudentDashboardComponent } from '../student-dashboard/StudentDashboard';
import { getArticles } from '../../services/api/articles.service';
import { IArticleMeta } from '../../interfaces/article';
import { LoadingSpinner } from '../loading-spinner';
import { IGetArticlesResponse } from '../../interfaces/api';
import { IUser, Role } from '../../interfaces/user';

function App():JSX.Element {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loggedIn, setLoggedIn] = useState(!!process.env.REACT_APP_START_LOGGED_IN);
  const [articles, setArticles] = useState<IArticleMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<IUser | undefined>(loggedIn ? {
    role: Role.ADMIN,
    student: {
      _id: '', email: '', name: '', usosId: '', registeredAt: new Date(),
    },
  } : undefined);
  const [, setError] = useState('');

  const getAndSetCourses = async () => {
    try {
      setLoading(true);
      const [
        { courses: _courses }, { articles: _articles },
      ] = await Promise.all([
        getCourses(),
        getArticles().catch(() => ({ articles: [] } as IGetArticlesResponse)),
      ]);
      setCourses(_courses.map((x) => new Course(x)));
      setArticles(_articles);
    } catch (e) {
      console.error(e);
      setError(`GetAndSetCourse() ${e}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getAndSetCourses(); }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      <AppContext.Provider value={{
        loggedIn, setLoggedIn, user, setUser,
      }}
      >
        <header />
        <main>
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
        </main>
        <FooterComponent />
      </AppContext.Provider>
    </div>
  );
}

export default App;
