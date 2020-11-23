import React from 'react';
import { Button } from 'react-bootstrap';
import './Home.scss';

const onScroll = () => {
  const v = window.scrollY;
  document.documentElement.dataset.scroll = v.toString();
};

function HomeComponent(): JSX.Element {
  document.documentElement.dataset.scroll = '0';
  document.addEventListener('scroll', onScroll);

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
