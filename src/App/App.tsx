import { useState } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import styles from './App.module.scss'
import Header from 'components/Header'
import GroupsPage from 'pages/GroupsPage'
import CalendarPage from 'pages/CalendarPage'
import AccommodationPage from 'pages/AccommodationPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <HashRouter>
        <Header/>
        <div className={styles.content}>
          <Routes >
            <Route path='/' element={<GroupsPage/>}/>
            <Route path='/calendar' element={<CalendarPage/>}/>
            <Route path='/accommodation' element={<AccommodationPage/>}/>
          </Routes>
        </div>
      </HashRouter>
    </>
  )
}

export default App
