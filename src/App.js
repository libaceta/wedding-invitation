import { Routes, Route, Link, BrowserRouter } from "react-router-dom";

import EventConfirmationPage from "./components/EventConfirmationPage";

import styles from './App.css';

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
          </ul>
          <Routes>
            <Route exact path="/" element={<h2>Home</h2>} />
            <Route path="/events/:eventId/confirm-attend" element={<EventConfirmationPage/>} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
