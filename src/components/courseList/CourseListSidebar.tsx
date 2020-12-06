/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { RefObject } from 'react';
import { ButtonGroup, Button, Form } from 'react-bootstrap';
import Dropdown from 'react-dropdown';
import { useTranslation } from 'react-i18next';
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

  const [t] = useTranslation();

  return (
    <div className="sidebar-container my-4 col-auto box-wrapper" style={{ alignContent: 'center' }}>
      <div className="row justify-content-center">
        <aside className="box sidebar col">
          <div className="box-inner">
            <Form>
              <Form.Group className="my-2 ">
                <Form.Label>
                  {t('MAIN.FILTER.LANGUAGE')}
                </Form.Label>
                <Form.Row>
                  <ButtonGroup>
                    <Button
                      className="shadow-none btn"
                      active={languageFilter === Language.ANY}
                      onClick={() => setLanguageFilter(Language.ANY)}
                    >
                      {t('MAIN.FILTER.LANGUAGE_ANY')}
                    </Button>
                    <Button
                      className="shadow-none btn"
                      active={languageFilter === Language.PL}
                      onClick={() => setLanguageFilter(Language.PL)}
                    >
                      {t('MAIN.FILTER.LANGUAGE_PL')}
                    </Button>
                    <Button
                      className="shadow-none btn"
                      active={languageFilter === Language.EN}
                      onClick={() => setLanguageFilter(Language.EN)}
                    >
                      {t('MAIN.FILTER.LANGUAGE_EN')}
                    </Button>
                  </ButtonGroup>
                </Form.Row>
              </Form.Group>
              <Form.Group className="my-2 cat">
                <Form.Label>
                  {t('MAIN.FILTER.STATUS')}
                </Form.Label>
                <Form.Row>
                  <ButtonGroup>
                    <Button
                      className="shadow-none"
                      active={statusFilter === Status.ANY}
                      onClick={() => setStatusFilter(Status.ANY)}
                    >
                      {t('MAIN.FILTER.STATUS_ANY')}
                    </Button>
                    <Button
                      className="shadow-none"
                      active={statusFilter === Status.OPEN}
                      onClick={() => setStatusFilter(Status.OPEN)}
                    >
                      {t('MAIN.FILTER.STATUS_OPEN')}
                    </Button>
                    <Button
                      className="shadow-none"
                      active={statusFilter === Status.CLOSED}
                      onClick={() => setStatusFilter(Status.CLOSED)}
                    >
                      {t('MAIN.FILTER.STATUS_CLOSED')}
                    </Button>
                  </ButtonGroup>
                </Form.Row>
              </Form.Group>
              <Form.Group className="my-2" style={{ maxWidth: 250 }}>
                <Dropdown
                  options={[
                    { value: '', label: t('MAIN.FILTER.SEMESTER_ANY') },
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
              </Form.Group>
            </Form>
            <nav className="category">
              <h4>{t('MAIN.COURSES')}</h4>
              <ul className="category-list">
                {filteredCourses
                  .map((course) => (
                    <li key={course._id}>
                      <span
                        onClick={() => {
                          if (scrollRefs[course._id] && scrollRefs[course._id].current) {
                            (scrollRefs[course._id].current as HTMLDivElement)
                              .scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        {course.name}
                      </span>
                    </li>
                  ))}
              </ul>
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}
