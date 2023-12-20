import {HashRouter, Routes, Route, Navigate, useNavigate} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import {setCommonAction, setUserInfoAction, setIsUserInfoLoadingAction, useUserInfo} from 'slices/MainSlice';
import 'react-toastify/dist/ReactToastify.css';
// import styles from './App.module.scss'
import Header from 'components/Header'
import GroupsPage from 'pages/GroupsPage'
import CalendarPage from 'pages/CalendarPage'
import SettlementPage from 'pages/SettlementPage'
import LoginPage from 'pages/LoginPage';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import React from 'react';
import {API_URL} from 'components/urls';
import {getCookie} from "../components/get_cookie";
// import Loader from 'components/Loader';

function CommonInfo (): React.ReactNode {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.withCredentials = true;

    const getUserInfo = async () => {
        try {
            const response = await axios(API_URL + `self`, {
                method: 'GET'
            })

            dispatch(setUserInfoAction({
                id: response.data.id,
                firstName: response.data.first_name,
                lastName: response.data.last_name
            }))
        } catch {

        } finally {
            dispatch(setIsUserInfoLoadingAction(false))
        }
    }

    const getCommonInfo = async () => {
        try {
            const response = await axios(API_URL + `common/info`, {
                method: 'GET'
            })

            dispatch(setCommonAction({
                name: response.data.name,
                startDate: response.data.start_date,
                endDate: response.data.end_date,
                color: response.data.color,
                logo: response.data.logo
            }))
            document.title = response.data.name;

            axios.interceptors.request.use(
                config => {
                    config.headers['X-CSRFTOKEN'] = getCookie('csrftoken');
                    return config;
                },
                error => {
                    return Promise.reject(error);
                }
            );
            getUserInfo();
        } catch {
          
        }
    }

    React.useEffect(() => {
        axios.interceptors.response.use(
            response => {
                return response;
            },
            async error => {
                if(error.response.status == 403) {
                    navigate('/login');
                }
            }
        );
        getCommonInfo()
    }, [])

    return null
}

function App() {
  const userInfo = useUserInfo();

  return (
    <div className='app'>
      <HashRouter>
        <CommonInfo />
        <>
        <Header></Header>
        {/* {isUserInfoLoading ? <div className={styles.loader__wrapper}>
              <Loader className={styles.loader} size='l' />
          </div>
          : <div className={styles.content}> */}
          <Routes >
           {!userInfo ? <>
              <Route path='/login' element={<LoginPage/>}></Route>
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
            :
            <>
              <Route path='/groups' element={<GroupsPage/>}/>
              <Route path='/calendar' element={<CalendarPage/>}/>
              <Route path='/buildings' element={<SettlementPage/>}/>
              <Route path="*" element={<Navigate to="/groups" replace />} />
            </>
            }
          </Routes>
          </>
        {/* </div>} */}
      </HashRouter>
      <ToastContainer autoClose={1000} pauseOnHover={false} />
    </div>
  )
}

export default App
