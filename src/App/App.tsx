import { useState } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import styles from './App.module.scss'
import Header from 'components/Header'
import GroupsPage from 'pages/GroupsPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <HashRouter>
      <Header/>
        <Routes>
          <Route path='/' element={<GroupsPage/>}/>
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
