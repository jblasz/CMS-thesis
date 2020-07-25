import React, { useState, useEffect } from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import Switch from 'react-bootstrap/esm/Switch';
import { Container } from 'react-bootstrap';
import { NavigationBarComponent } from '../navbar';
import { HomeComponent } from '../home';
import { LoginComponent } from '../login';
import { RegisterComponent } from '../register';
import { CoursesComponent } from '../courses';
import { ResearchComponent } from '../research';
import { ArticlesComponent } from '../articles';
import { FooterComponent } from '../footer';
import { getCourses } from '../../services/courses/courses.service';
import { Course } from '../../interfaces/course';

function App():JSX.Element {
  const [courses, setCourses] = useState<Course[]>([]);

  const getAndSetCourses = async () => {
    const loadedCourses = await getCourses();
    setCourses(loadedCourses.courses.map((x) => new Course(x)));
  };

  useEffect(() => { getAndSetCourses(); }, []);

  return (
    <div className="App">
      <header>
        <NavigationBarComponent courses={courses} />
      </header>
      <Container fluid>
        <main>
          <Switch>
            <Route exact path="/" component={HomeComponent} />
            <Route exact path="/login" component={LoginComponent} />
            <Route path="/register" component={RegisterComponent} />
            <Route path="/courses" component={() => <CoursesComponent courses={courses} />} />
            <Route path="/research" component={ResearchComponent} />
            <Route path="/articles" component={ArticlesComponent} />
          </Switch>
        </main>
      </Container>
      <footer>
        <FooterComponent />
      </footer>
    </div>
  );
}

export default App;
