import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom'
import styles from './Header.module.scss'
import ProfileIcon from 'components/Icons/ProfileIcon';

const Header: React.FC = () => {
    return (
        <div className={styles.header}>
            <div className={styles.header__wrapper}>
                <Link to='/' className={styles.header__logo}>Управление лагерями</Link>

                <div className={styles.header__blocks}>
                    <Link className={styles.header__block} to='/'>Состав лагеря</Link>
                    <Link className={styles.header__block} to='/'>Мероприятия</Link>
                    <Link className={styles.header__block} to='/'>Проживание</Link>
                </div>

                <div className={styles.header__icons}>
                        <div className={styles['application__icon-wrapper']}>
                            <ProfileIcon/>
                        </div>
                </div>
            </div>
        </div>
    )
};

export default Header;