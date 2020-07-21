import React from 'react';
import Switch from 'react-bootstrap/esm/Switch';
import { Route } from 'react-router-dom';
import CourseComponent from '../course/Course';

function CourseListComponent(): JSX.Element {
  return (
    <div>Course list</div>
  );
}

function CoursesComponent(): JSX.Element {
  return (
    <Switch>
      <Route exact path="/courses" component={CourseListComponent} />
      <Route path="/courses/:id" component={CourseComponent} />
    </Switch>
  );
}

export default CoursesComponent;
