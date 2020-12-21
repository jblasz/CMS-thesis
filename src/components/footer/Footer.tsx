import React from 'react';
import { Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
// import './Footer.scss';

function FooterComponent(): JSX.Element {
  const [t] = useTranslation();

  return (
    <Navbar
      className="nav footer"
      bg="light"
    >
      <Navbar.Text>
        <a href="https://ww2.mini.pw.edu.pl/" className="m-2">{t('FOOTER.MINI_URL')}</a>
      </Navbar.Text>
      <Navbar.Text>
        <a href="https://www.pw.edu.pl/engpw" className="m-2">{t('FOOTER.PW_URL')}</a>
      </Navbar.Text>
    </Navbar>
  );
}

export default FooterComponent;
