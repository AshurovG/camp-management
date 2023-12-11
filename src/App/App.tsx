import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './App.module.scss'
import Header from 'components/Header'
import GroupsPage from 'pages/GroupsPage'
import CalendarPage from 'pages/CalendarPage'
import SettlementPage from 'pages/SettlementPage'
import EventsPage from 'pages/EventsPage'
import EventMembersPage from 'pages/EventMembersPage'
import BuildingsDetailedPage from 'pages/BuildingsDetailedPage'
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  return (
    <div className='app'>
      <HashRouter>
        <Header></Header>
        <div className={styles.content}>
          <Routes >
            <Route path='/' element={<GroupsPage/>}/>
            <Route path='/calendar' element={<CalendarPage/>}/>
            <Route path='/buildings' element={<SettlementPage/>}/>
            <Route path='/buildings'>
              <Route path=':id' element={<BuildingsDetailedPage/>}></Route>
            </Route>
            <Route path="/events">
              <Route path=":id" element={<EventsPage />} />
            </Route>
            <Route path="/events_members">
              <Route path=":id" element={<EventMembersPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </HashRouter>
      <ToastContainer autoClose={1000} pauseOnHover={false} />
    </div>
  )
}

export default App
