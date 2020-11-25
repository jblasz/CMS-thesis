import React, { RefObject, useState } from 'react';
// import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import 'react-dropdown/style.css';
import './CourseList.scss';
import { Course, CourseLanguage } from '../../interfaces/course';
import { CourseListSidebarComponent, Status, Language } from './CourseListSidebar';

export interface CourseListComponentProps {
  courses: Course[];
}

function CourseListComponent(props: CourseListComponentProps): JSX.Element {
  // const [t] = useTranslation();
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
          <section className="justify-content-center tiles-wrap row">
            {courses.map((course) => (
              <Link to={`/courses/${course._id}`} className="card-container col-5 m-3" key={course._id}>
                <div className="row title justify-content-between">
                  <h5>{course.name}</h5>
                  <div className="nav-link">{course.semester}</div>
                </div>
                <div className="row description">
                  <p>{course.description}</p>
                </div>
              </Link>
            ))}
          </section>
        </div>
      </div>
    </section>
  );
}

export default CourseListComponent;
