import { Routes, Route, BrowserRouter } from "react-router-dom";

import EventConfirmationPage from "./components/pages/event-confirmation/EventConfirmationPage";

import styles from './App.css';
import GuestListPage from "./components/pages/guest-list/GuestListPage";
import ThanksPage from "./components/pages/thanks/ThanksPage";

function App() {

  return (
    <div className={styles.background}>
      <BrowserRouter>
        <div>
          <Routes>
            <Route exact path="/" element={<h2>Home</h2>} />
            <Route path="/events/:eventId/confirm-attend" element={<EventConfirmationPage/>} />
            <Route path="/events/:eventId/guest-list" element={<GuestListPage/>} />
            <Route path="/thanks" element={<ThanksPage/>} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
