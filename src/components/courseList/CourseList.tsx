import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ButtonGroup, Button,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Dropdown from 'react-dropdown';
import { Course, CourseLanguage } from '../../interfaces/course';
import 'react-dropdown/style.css';
import './CourseList.css';

export interface CourseListComponentProps {
  courses: Course[];
}

enum Language {
  ANY = 0,
  PL,
  EN
}

enum Status {
  ANY = 0,
  OPEN,
  CLOSED
}

function CourseListComponent(props: CourseListComponentProps): JSX.Element {
  const [t] = useTranslation();
  const { courses } = props;

  const [languageFilter, setLanguageFilter] = useState(Language.ANY);
  const [statusFilter, setStatusFilter] = useState(Status.OPEN);
  const [semesterFilter, setSemesterFilter] = useState('');

  const semesters = ['any', ...new Set(courses.map((c) => c.semester).sort().reverse())];

  return (
    <section className="">
      <div className="site-content">
        <div className="posts">
          <section className="details-card">
            <div className="row justify-content-center">
              {courses.map((course) => (
                <div className="card col-6 px-3">
                  <div className="card-content">
                    <div className="card-img">
                      <img src="https://placeimg.com/380/230/nature" alt="" />
                      <span><h4>{course.semester}</h4></span>
                    </div>
                    <div className="card-desc">
                      <h3>{course.name}</h3>
                      <p>
                        {course.description}
                      </p>
                      <Link className="btn-card" to={`/courses/${course._id}`}>{t('COURSE.LABORATORY.GOTO')}</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        <aside className="sidebar mx-4">
          <div className="my-2">
            <div className="my-2">
              <ButtonGroup>
                <Button
                  className="shadow-none button"
                  active={languageFilter === Language.ANY}
                  onClick={() => setLanguageFilter(Language.ANY)}
                >
                  *
                </Button>
                <Button
                  className="shadow-none button"
                  active={languageFilter === Language.PL}
                  onClick={() => setLanguageFilter(Language.PL)}
                >
                  pl
                </Button>
                <Button
                  className="shadow-none button"
                  active={languageFilter === Language.EN}
                  onClick={() => setLanguageFilter(Language.EN)}
                >
                  en
                </Button>
              </ButtonGroup>
            </div>
            <div className="my-2">
              <ButtonGroup>
                <Button
                  className="shadow-none button"
                  active={statusFilter === Status.ANY}
                  onClick={() => setStatusFilter(Status.ANY)}
                >
                  *
                </Button>
                <Button
                  className="shadow-none button"
                  active={statusFilter === Status.OPEN}
                  onClick={() => setStatusFilter(Status.OPEN)}
                >
                  ongoing
                </Button>
                <Button
                  className="shadow-none button"
                  active={statusFilter === Status.CLOSED}
                  onClick={() => setStatusFilter(Status.CLOSED)}
                >
                  closed
                </Button>
              </ButtonGroup>
            </div>
            <div className="my-2" style={{ maxWidth: 250 }}>
              <Dropdown
                options={semesters}
                value={semesterFilter}
                onChange={(event) => {
                  setSemesterFilter(event.value);
                }}
              />
            </div>
          </div>
          <div className="category">
            <h2>Courses</h2>
            <ul className="category-list">
              {courses
                .filter((course) => (semesterFilter ? course.semester === semesterFilter : true))
                .filter((course) => (languageFilter
                  ? (course.language === CourseLanguage.EN && languageFilter === Language.EN)
                    || (course.language === CourseLanguage.PL && languageFilter === Language.PL)
                  : true))
                .filter((course) => (statusFilter
                  ? (course.active && statusFilter === Status.OPEN)
                    || (!course.active && statusFilter === Status.CLOSED)
                  : true))
                .map((course) => (
                  <li className="list-items">
                    <span>{course.name}</span>
                    <span>{course.semester}</span>
                  </li>
                ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default CourseListComponent;
