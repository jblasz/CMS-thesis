import React from 'react';
import { Button, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

interface FooterComponentProps {
  onRefresh: () => void
}

function FooterComponent(props: FooterComponentProps): JSX.Element {
  const { onRefresh } = props;
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
      <div className="float-right">
        <Button className="btn button btn-primary" onClick={onRefresh}>Mock page refresh (to see changes to navbar)</Button>
      </div>
    </Navbar>
  );
}

export default FooterComponent;
