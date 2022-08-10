import { Routes, Route, Link, BrowserRouter } from "react-router-dom";

import EventConfirmationPage from "./components/EventConfirmationPage";

import styles from './App.css';
import GuestListPage from "./components/GuestListPage";

function App() {

  return (
    <div className={styles.background}>
      <BrowserRouter>
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/events/1/confirm-attend">Attend</Link>
            </li>
            <li>
              <Link to="/events/1/guest-list">List</Link>
            </li>
          </ul>
          <Routes>
            <Route exact path="/" element={<h2>Home</h2>} />
            <Route path="/events/:eventId/confirm-attend" element={<EventConfirmationPage/>} />
            <Route path="/events/:eventId/guest-list" element={<GuestListPage/>} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
