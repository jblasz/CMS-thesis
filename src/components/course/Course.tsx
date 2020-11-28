import React, { useState, useEffect } from 'react';
import { useParams, Redirect, Link } from 'react-router-dom';
import {
  Col,
  Container, Jumbotron, Row,
} from 'react-bootstrap';
import { Course, CourseLanguage } from '../../interfaces/course';
import { LoadingSpinner } from '../loading-spinner';
import { getCourse } from '../../services/api/courses.service';
import './Course.scss';
import { CourseLaboratory } from '../../interfaces/courseLaboratory';
import { formatDate } from '../../utils';

function computeDate(lab: CourseLaboratory) {
  const dates = new Set<string>();
  Object.values(lab.tasks).forEach((task) => {
    if (task.dateFrom) {
      dates.add(formatDate(task.dateFrom));
    }
  });
  return [...dates].reduce((agg, curr) => `${agg}, ${curr}`);
}

function CourseComponent(): JSX.Element {
  const { id } = useParams<{id: string}>();

  const [courseState, setCourseState] = useState({
    loading: true,
    error: false,
    course: new Course({
      _id: id,
      description: '',
      groups: [],
      laboratories: [],
      language: CourseLanguage.EN,
      links: [],
      name: '',
      semester: '',
      active: true,
      shown: true,
    }),
  });

  const { course, loading, error } = courseState;

  const getAndSetCourse = async (courseID: string) => {
    try {
      const c = await getCourse(courseID);
      setCourseState({
        loading: false,
        course: new Course(c.course),
        error: false,
      });
    } catch (e) {
      setCourseState({
        loading: false,
        course: new Course(),
        error: true,
      });
    }
  };

  useEffect(() => {
    getAndSetCourse(id);
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Redirect to="/404" />;
  }

  return (
    <Container>
      <Col>
        <Row>
          <Col>
            <Jumbotron>
              <h1>{course.name}</h1>
              <p>{course.description}</p>
            </Jumbotron>
          </Col>
        </Row>
        <Row>
          <div className="col-md-10 offset-md-1">
            <ul className="timeline">
              {course.laboratories.map((lab) => (
                <li key={lab._id}>
                  <h6 className="float-right">{computeDate(lab)}</h6>
                  <Link
                    className="nav-link"
                    role="button"
                    aria-pressed="true"
                    to={`/courses/${course._id}/laboratory/${lab._id}`}
                  >
                    <h3>{lab.name}</h3>
                  </Link>
                  <p>{lab.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </Row>

      </Col>
    </Container>
  );
}

export default CourseComponent;
