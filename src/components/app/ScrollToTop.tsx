import { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { History } from 'history';

function ScrollToTop(props: { history: History }) {
  const { history } = props;
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });
    return () => {
      unlisten();
    };
  }, [history]);

  return (null);
}

export default withRouter(ScrollToTop);
