import React, { useState } from 'react'
import axios from 'axios'
import styles from './DetailedInfo.module.scss'
import { UserData, DetailedUserData } from '../../../types';
import Loader from 'components/Loader';
import Button from 'components/Button';
import BasketIcon from 'components/Icons/BasketIcon';
import EditIcon from 'components/Icons/EditIcon';

export type DetailedInfoProps = {
  id: number;
  onBackButtonClick: () => void;
};

const DetailedInfo: React.FC<DetailedInfoProps> = ({id, onBackButtonClick}) => {
  const [currentUser, setCurrentUser] = useState<DetailedUserData>()
  const [isUserDataLoading, setIsUserDataLoading] = useState(true)

  const getDetailedUser = async () => {
    try {
      const response = await axios(`https://specializedcampbeta.roxmiv.com/api/users/${id}/detailed`, {
        method: 'GET'
      })
      setCurrentUser({
        firstName: response.data.first_name,
        lastName: response.data.last_name,
        room: response.data.room,
        appGroups: response.data.app_groups
      })
      setIsUserDataLoading(false)
    } catch(e) {
      throw e
    }
  }

  React.useEffect(() => {
    getDetailedUser();
  }, [])

  return (
    <div className={styles.detailed}>
      {isUserDataLoading ? <div className={styles.loader__wrapper}>
                <Loader className={styles.loader} size='l' />
            </div>
      : <>
        <h4 className={styles.detailed__title}>Информация об участнике</h4>
        
        <ul className={styles.detailed__list}>
          <li className={styles['detailed__list-item']}>
            Имя: {currentUser?.firstName}
          </li>
          <li className={styles['detailed__list-item']}>
            Фамилия: {currentUser?.lastName}
          </li>
          {/* {currentUser?.room &&  */}
            <li className={styles['detailed__list-item']}>Комната: № {5}</li>
          {currentUser?.appGroups.length !== 0 && (
          <li>
            Группа: {currentUser?.appGroups.map((group, index) => (
              <React.Fragment key={group.id}>
                {group.name}
                {index !== currentUser.appGroups.length - 1 && ', '}
              </React.Fragment>
            ))}
          </li>
          )}
        </ul>
        <div className={styles.detailed__btns}>
          <div className={styles.detailed__icons}>
            <EditIcon/>
            <BasketIcon/>
          </div>
          <Button onClick={onBackButtonClick} className={styles.detailed__btn}>Назад</Button>
        </div>
      </>}
    </div>
  )
}

export default DetailedInfo