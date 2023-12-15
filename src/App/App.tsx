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
import LoginPage from 'pages/LoginPage';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import React from 'react';

function App() {
  // const getUserInfo = async () => {
  //   try {
  //     const response = await axios(`https://specializedcampbeta.roxmiv.com/api/self`, {
  //       method: 'GET',
  //       withCredentials: true
  //     })
  //   } catch {
      
  //   }
  // }

  const getCommonInfo = async () => {
    try {
      const response = await axios(`https://specializedcampbeta.roxmiv.com/api/common/info`, {
        method: 'GET',
        // withCredentials: true
      })
    } catch {

    }
  }

  React.useEffect(() => {
    // getUserInfo()
    getCommonInfo()
  }, [])

  return (
    <div className='app'>
      <HashRouter>
        <Header></Header>
        <div className={styles.content}>
          <Routes >
            <Route path='/login' element={<LoginPage/>}></Route>
            <Route path='/' element={<GroupsPage/>}/>
            <Route path='/calendar' element={<CalendarPage/>}/>
            <Route path='/buildings' element={<SettlementPage/>}/>
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
