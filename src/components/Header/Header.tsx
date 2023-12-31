import React, { useState } from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify';
import styles from './Header.module.scss'
import ProfileIcon from 'components/Icons/ProfileIcon';
import ProfileWindow from 'components/ProfileWindow';
import BurgerIcon from 'components/Icons/BurgerIcon';
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from 'react-redux';
import {useCommon, useUserInfo, useIsUserInfoLoading, setIsUserInfoLoadingAction, setUserInfoAction} from 'slices/MainSlice';
import {API_URL} from 'components/urls';


const Header: React.FC = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const common = useCommon()
    const userInfo = useUserInfo();
    const isUserInfoLoading = useIsUserInfoLoading()
    const [isProfileButtonClicked, setIsProfileButtonClicked] = useState(false)
    const [isBurgerMenuOpened, setIsBurgerMenuOpened] = useState(false)

    const logout = async () => {
        try {
            await axios(API_URL + `logout`, {
                method: 'POST'
            })
            dispatch(setUserInfoAction(null))
            toast.success('Вы успешно вышли из системы!')
            navigate('/login')
        } catch(e) {
            throw e
        } finally {
            dispatch(setIsUserInfoLoadingAction(false))
        }
    }

    const handleLogoutButtonClick = () => {
        dispatch(setIsUserInfoLoadingAction(true))
        logout(); 
        setIsProfileButtonClicked(false)
    }

    return (
        <div className={styles.header}>
            <div className={styles.header__wrapper}>
                {userInfo && !isUserInfoLoading && <span className={styles.header__logo}>{common?.name}</span>}

                <div className={styles.header__blocks}>
                    <Link className={styles.header__block} to='/groups'>Состав лагеря</Link>
                    <Link className={styles.header__block} to='/buildings'>Размещение</Link>
                    <Link className={styles.header__block} to='/calendar'>Мероприятия</Link>
                </div>

                <div className={styles.header__icons}>
                    <div className={styles['application__icon-wrapper']}>
                        <ProfileIcon onClick={() => setIsProfileButtonClicked(!isProfileButtonClicked)}/>
                    </div>
                    {isBurgerMenuOpened === false
                        ? <BurgerIcon className={styles.burger__icon} color='accent' onClick={() => setIsBurgerMenuOpened(true)} />
                        : <div className={styles.cancel__icon} onClick={() => setIsBurgerMenuOpened(false)}></div>}
                    {isBurgerMenuOpened &&
                    <div className={styles.burger__menu}>
                        <Link onClick={() => setIsBurgerMenuOpened(false)} className={styles['burger__menu-item']} to={'/'}>Состав лагеря</Link>
                        <Link onClick={() => setIsBurgerMenuOpened(false)} className={styles['burger__menu-item']} to={`/buildings`}>Размещение</Link>
                        <Link onClick={() => setIsBurgerMenuOpened(false)} className={styles['burger__menu-item']} to={`/calendar`}>Мероприятия</Link>
                    </div>}
                </div>

                <AnimatePresence>
                {isProfileButtonClicked && (
                    <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        marginTop: 220,
                        position: "absolute",
                        right: 0,
                    }}
                    >
                    <ProfileWindow
                        fullname={`${userInfo?.firstName} ${userInfo?.lastName}`}
                        onClick={handleLogoutButtonClick}
                    />
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
    )
};

export default Header;