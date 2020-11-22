import React from 'react';
import { Button } from 'react-bootstrap';

function HomeComponent(): JSX.Element {
  return (
    <section className="site-title">
      <div className="site-background">
        <h3>Big site header title</h3>
        <h1>Smaller site header subtitle</h1>
        <Button>Button that goes somewhere</Button>
      </div>
    </section>
  );
}

export default HomeComponent;
