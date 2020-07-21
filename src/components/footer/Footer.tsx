import React from 'react';
import { Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './Footer.css';

function FooterComponent(): JSX.Element {
  const [t] = useTranslation();

  return (
    <Navbar bg="light" expand="lg" fixed="bottom">
      <Navbar.Text>
        {t('FOOTER.DESCR')}
      </Navbar.Text>
      <Navbar.Text>
        <a href="https://ww2.mini.pw.edu.pl/" className="mr-3">{t('FOOTER.MINI_URL')}</a>
        <a href="https://www.pw.edu.pl/engpw" className="mr-3">{t('FOOTER.PW_URL')}</a>
      </Navbar.Text>
    </Navbar>
  );
}

export default FooterComponent;
