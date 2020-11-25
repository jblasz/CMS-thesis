/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { RefObject } from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import Dropdown from 'react-dropdown';
import { Course } from '../../interfaces/course';
import './CourseListSidebar.scss';

export enum Language {
  ANY = 0,
  PL,
  EN
}

export enum Status {
  ANY = 0,
  OPEN,
  CLOSED
}

interface CourseListSidebarComponentProps {
  languageFilter: Language
  setLanguageFilter: (x: Language) => void
  statusFilter: Status
  setStatusFilter: (x: Status) => void
  semesterFilter: string
  setSemesterFilter: (x: string) => void
  semesters: string[]
  scrollRefs: {[key: string]: RefObject<HTMLDivElement>}
  filteredCourses: Course[]
}

export function CourseListSidebarComponent(props: CourseListSidebarComponentProps): JSX.Element {
  const {
    languageFilter,
    setLanguageFilter,
    statusFilter,
    semesterFilter,
    setSemesterFilter,
    setStatusFilter,
    semesters,
    filteredCourses,
    scrollRefs,
  } = props;

  return (
    <div className="sidebar-container my-4 col-auto">
      <aside className="sidebar">
        <div className=" justify-content-center">
          <div className="my-2 cat justify-content-center">
            <ButtonGroup>
              <Button
                className="shadow-none btn"
                active={languageFilter === Language.ANY}
                onClick={() => setLanguageFilter(Language.ANY)}
              >
                *
              </Button>
              <Button
                className="shadow-none btn"
                active={languageFilter === Language.PL}
                onClick={() => setLanguageFilter(Language.PL)}
              >
                pl
              </Button>
              <Button
                className="shadow-none btn"
                active={languageFilter === Language.EN}
                onClick={() => setLanguageFilter(Language.EN)}
              >
                en
              </Button>
            </ButtonGroup>
          </div>
          <div className="my-2 cat">
            <ButtonGroup>
              <Button
                className="shadow-none"
                active={statusFilter === Status.ANY}
                onClick={() => setStatusFilter(Status.ANY)}
              >
                *
              </Button>
              <Button
                className="shadow-none"
                active={statusFilter === Status.OPEN}
                onClick={() => setStatusFilter(Status.OPEN)}
              >
                ongoing
              </Button>
              <Button
                className="shadow-none"
                active={statusFilter === Status.CLOSED}
                onClick={() => setStatusFilter(Status.CLOSED)}
              >
                closed
              </Button>
            </ButtonGroup>
          </div>
          <div className="my-2" style={{ maxWidth: 250 }}>
            <Dropdown
              options={[
                { value: '', label: 'any' },
                ...semesters.map((sem) => ({
                  value: sem,
                  label: sem,
                })),
              ]}
              value={semesterFilter}
              onChange={(event) => {
                setSemesterFilter(event.value);
              }}
            />
          </div>
        </div>
        <nav className="category">
          <h2>Courses</h2>
          <ul className="category-list">
            {filteredCourses
              .map((course) => (
                <li key={course._id}>
                  <span
                    onClick={() => {
                      if (scrollRefs[course._id] && scrollRefs[course._id].current) {
                        (scrollRefs[course._id].current as HTMLDivElement).scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    {course.name}
                  </span>
                </li>
              ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
}
