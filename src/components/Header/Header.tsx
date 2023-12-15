import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import styles from './Header.module.scss'
import ProfileIcon from 'components/Icons/ProfileIcon';
import ProfileWindow from 'components/ProfileWindow';
import { motion, AnimatePresence } from "framer-motion";

const Header: React.FC = () => {
    const [isProfileButtonClicked, setIsProfileButtonClicked] = useState(false)

    return (
        <div className={styles.header}>
            <div className={styles.header__wrapper}>
                <Link to='/' className={styles.header__logo}>Управление лагерем</Link>

                <div className={styles.header__blocks}>
                    <Link className={styles.header__block} to='/'>Состав лагеря</Link>
                    <Link className={styles.header__block} to='/calendar'>Мероприятия</Link>
                    <Link className={styles.header__block} to='/buildings'>Проживание</Link>
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