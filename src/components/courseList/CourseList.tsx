import React, { RefObject, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import 'react-dropdown/style.css';
import './CourseList.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';
import { Course, CourseLanguage } from '../../interfaces/course';
import { CourseListSidebarComponent, Status, Language } from './CourseListSidebar';

export interface CourseListComponentProps {
  courses: Course[];
}

function CourseListComponent(props: CourseListComponentProps): JSX.Element {
  const [t] = useTranslation();
  const { courses } = props;

  const [languageFilter, setLanguageFilter] = useState(Language.ANY);
  const [statusFilter, setStatusFilter] = useState(Status.OPEN);
  const [semesterFilter, setSemesterFilter] = useState('');
  const [scrollRefs] = useState<{[key: string]: RefObject<HTMLDivElement>}>({});

  const filteredCourses = courses
    .filter((course) => (semesterFilter ? course.semester === semesterFilter : true))
    .filter((course) => (languageFilter
      ? (course.language === CourseLanguage.EN && languageFilter === Language.EN)
      || (course.language === CourseLanguage.PL && languageFilter === Language.PL)
      : true))
    .filter((course) => (statusFilter
      ? (course.active && statusFilter === Status.OPEN)
      || (!course.active && statusFilter === Status.CLOSED)
      : true));

  filteredCourses.forEach((course) => {
    scrollRefs[course._id] = React.createRef<HTMLDivElement>();
  });

  const semesters = [...new Set(courses.map((c) => c.semester).sort().reverse())];

  return (
    <section className="">
      <div className="row site-content">
        <CourseListSidebarComponent
          filteredCourses={filteredCourses}
          languageFilter={languageFilter}
          scrollRefs={scrollRefs}
          semesterFilter={semesterFilter}
          semesters={semesters}
          setLanguageFilter={setLanguageFilter}
          setSemesterFilter={setSemesterFilter}
          setStatusFilter={setStatusFilter}
          statusFilter={statusFilter}
        />
        <div className="col">
          <section className="details-card">
            <div className="row justify-content-center">
              <section className="courses-container row">
                {courses.map((course) => (
                  <div className="card-container col-5" key={course._id}>
                    <div className="card">
                      <Link to={`/courses/${course._id}`}>
                        <div className="card--display">
                          <FontAwesomeIcon icon={faRobot} size="2x" />
                          <h2>{course.name}</h2>
                        </div>
                        <div className="card--hover">
                          <h4>{course.name}</h4>
                          <p>{course.description}</p>
                          <p className="link">{t('COURSE.LABORATORY.GOTO')}</p>
                        </div>
                      </Link>
                      <div className="card--border" />
                    </div>
                  </div>
                ))}
              </section>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

export default CourseListComponent;
