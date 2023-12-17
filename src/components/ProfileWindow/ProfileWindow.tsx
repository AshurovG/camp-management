import * as React from 'react';
import cn from 'classnames'
import styles from './ProfileWindow.module.scss';
// import Button from 'react-bootstrap/Button'
import Button from 'components/Button'
import ProfileLogoIcon from 'components/Icons/ProfileLogoIcon';
// import { Link } from 'react-router-dom';

export type ModalProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    onClick?: () => void;
    className?: string;
    fullname: string | undefined;
};

const ProfileWindow: React.FC<ModalProps> = ({
    fullname,
    onClick,
    className

}) => {
    return (
        <div className={cn(styles.modal, className)}>
            <div className={styles.title__block}>
                <ProfileLogoIcon></ProfileLogoIcon>
                <h3 className={styles.modal__title}>Ваш профиль</h3>
            </div>
            <div className={styles.info}>
                <h5 className={styles.info__value}>{fullname}</h5>
                <Button className={styles.modal__btn} onClick={onClick}>Выйти</Button>
            </div>        
        </div>
    )
};

export default ProfileWindow;