import React from 'react';
import { useParams } from 'react-router-dom';

function CourseComponent(): JSX.Element {
  const { id } = useParams();
  return (
    <div>
      Course component of id
      {' '}
      {id}
    </div>
  );
}

export default CourseComponent;
