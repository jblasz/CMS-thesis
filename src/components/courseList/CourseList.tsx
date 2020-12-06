/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { RefObject, useState } from 'react';
import { Link } from 'react-router-dom';
import 'react-dropdown/style.css';
import './CourseList.scss';
import { Parallax } from 'react-parallax';
import { useTranslation } from 'react-i18next';
import { Course, CourseLanguage } from '../../interfaces/course';
import { CourseListSidebarComponent, Status, Language } from './CourseListSidebar';
import bgImg from '../../images/main_2.jpeg';

export interface CourseListComponentProps {
  courses: Course[];
}

function CourseListComponent(props: CourseListComponentProps): JSX.Element {
  const { courses: _courses } = props;
  const courses = [..._courses].sort((a, b) => (a.active !== b.active
    ? +b.active - +a.active
    : a.semester > b.semester
      ? 1
      : a.semester < b.semester
        ? -1
        : 0
  ));

  const [t] = useTranslation();
  const [languageFilter, setLanguageFilter] = useState(Language.ANY);
  const [statusFilter, setStatusFilter] = useState(Status.ANY);
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
      : true))
    .sort((a, b) => b.name.localeCompare(a.name));

  filteredCourses.forEach((course) => {
    scrollRefs[course._id] = React.createRef<HTMLDivElement>();
  });

  const semesters = [...new Set(courses.map((c) => c.semester).sort().reverse())];

  return (
    <div className="col m-0">
      <Parallax blur={0} bgImage={bgImg} bgImageAlt="mini" strength={-200}>
        <div
          className="site-title"
          onClick={() => {
            const ref = Object.values(scrollRefs)
              && Object.values(scrollRefs)[0]
              && Object.values(scrollRefs)[0].current;
            if (ref) {
              ref.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <div className="site-background">
            <h1>{t('MAIN.OWNER')}</h1>
            <h3>{t('MAIN.OWNER_TITLES')}</h3>
          </div>
        </div>
      </Parallax>
      <div className="row section static site-content">
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
              <Link to={`/courses/${course._id}`} className={`card-container col-3 m-3 ${course.active ? '' : 'inactive'}`} key={course._id} id={`li-course-${course._id}`}>
                {/*
                  below is a hack to scroll taking into account 80px navbar offset.
                  cleanest solution I could find, sadly.
                */}
                <div style={{ position: 'absolute', top: -80, left: 0 }} ref={scrollRefs[course._id]} />
                <div className={`row title justify-content-between ${course.active ? '' : 'inactive'}`}>
                  <h4>{course.name}</h4>
                  <p className="float-right">{course.semester}</p>
                </div>
                <div className="row description">
                  <p dangerouslySetInnerHTML={{ __html: course.descriptionShort }} />
                </div>
              </Link>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}

export default CourseListComponent;
