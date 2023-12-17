import React, { useState } from 'react';
// import axios from 'axios';
import { Link } from 'react-router-dom'
// import { toast } from 'react-toastify';
import styles from './Header.module.scss'
import ProfileIcon from 'components/Icons/ProfileIcon';
import ProfileWindow from 'components/ProfileWindow';
import { motion, AnimatePresence } from "framer-motion";
import { useCommon } from 'slices/MainSlice';

const Header: React.FC = () => {
    const common = useCommon()
    const [isProfileButtonClicked, setIsProfileButtonClicked] = useState(false)

    // const logout = async () => {
    //     try {
    //         const response = await axios(`https://specializedcampbeta.roxmiv.com/api/logout`, {
    //             method: 'POST',
    //             withCredentials: true
    //         })
    //         toast.success('Вы успешно вышли из систему!')
    //     } catch(e) {
    //         throw e
    //     } finally {
    //     }
    // }

    return (
        <div className={styles.header}>
            <div className={styles.header__wrapper}>
                <span className={styles.header__logo}>{common?.name}</span>

                <div className={styles.header__blocks}>
                    <Link className={styles.header__block} to='/'>Состав Лагеря</Link>
                    <Link className={styles.header__block} to='/buildings'>Размещение</Link>
                    <Link className={styles.header__block} to='/calendar'>Мероприятия</Link>
                </div>

                <div className={styles.header__icons}>
                    <div className={styles['application__icon-wrapper']}>
                        <ProfileIcon onClick={() => setIsProfileButtonClicked(!isProfileButtonClicked)}/>
                    </div>
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
                        fullname={'Ашуров Георгий'}
                        onClick={() => {}}
                    />
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
    )
};

export default Header;