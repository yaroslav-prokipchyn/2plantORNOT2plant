import { useCurrentUser } from 'src/context/hooks/useCurrentUserContext';
import AdminListView from './AdminListView.tsx';
import AgronomistListView from './AgronomistListView.tsx';

import 'src/pages/list-view/list-view.css';

function ListView() {
  const { isAgronomist } = useCurrentUser();

  return (
    <div className="dashboard-container">
      {isAgronomist ? <AgronomistListView /> : <AdminListView />}
    </div>
  );
}

export default ListView;
