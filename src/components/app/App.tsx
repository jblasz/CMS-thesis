import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import Switch from 'react-bootstrap/esm/Switch';
import { Container } from 'react-bootstrap';
import { NavigationBarComponent } from '../navbar';
import { HomeComponent } from '../home';
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
import './App.css';
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
import { AdminSubmissionComponent } from '../admin-submission';
import { AppContext } from '../../services/contexts/app-context';

function App():JSX.Element {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const getAndSetCourses = async () => {
    const loadedCourses = await getCourses();
    setCourses(loadedCourses.courses.map((x) => new Course(x)));
  };

  useEffect(() => { getAndSetCourses(); }, []);

  return (
    <div className="App">
      <AppContext.Provider value={{ loggedIn, setLoggedIn }}>
        <header>
          <NavigationBarComponent courses={courses} />
        </header>
        <Container className="content-wrap">
          <main>
            <Switch>
              <Route exact path="/" component={HomeComponent} />
              <Route exact path="/login" component={LoginComponent} />
              <Route exact path="/register" component={RegisterComponent} />
              <Route exact path="/courses/:id/laboratory/:labID" component={LaboratoryComponent} />
              <Route exact path="/courses/:id" component={CourseComponent} />
              <Route exact path="/courses" component={() => <CourseListComponent courses={courses} />} />
              <Route exact path="/research" component={ResearchComponent} />
              <Route exact path="/articles" component={ArticlesComponent} />
              <Route exact path="/code" component={CodeValidationComponent} />
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
              <PrivateRoute exact path="/admin/submissions/:id" component={AdminSubmissionComponent} />
              <Route exact path="/404" component={Component404} />
            </Switch>
          </main>
          <FooterComponent />
        </Container>
      </AppContext.Provider>
    </div>
  );
}

export default App;
