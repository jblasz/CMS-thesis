import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
import { WarningStripComponent } from '../info/WarningStrip';

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

  const [course, setCourse] = useState(new Course({
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
  }));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getAndSetCourse = async (courseID: string) => {
    try {
      setLoading(true);
      const { course: _course } = await getCourse(courseID);
      setCourse(new Course(_course));
    } catch (e) {
      console.error(e);
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAndSetCourse(id);
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <WarningStripComponent error={error} />
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
