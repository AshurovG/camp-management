import React, { useState, ChangeEvent } from 'react'
import { useDispatch } from 'react-redux';
import { useUsers, setUsersAction, setIsUserChangedAction } from 'slices/GroupsSlice';
import axios from 'axios'
import { toast } from 'react-toastify';
import styles from './DetailedInfo.module.scss'
import { DetailedUserData } from '../../../types';
import Loader from 'components/Loader';
import Button from 'components/Button';
import BasketIcon from 'components/Icons/BasketIcon';
import EditIcon from 'components/Icons/EditIcon';
import Form from 'react-bootstrap/Form';


export type DetailedInfoProps = {
  id: number;
  onBackButtonClick: () => void;
  onDeleteUserClick: () => void;
};

const DetailedInfo: React.FC<DetailedInfoProps> = ({id, onBackButtonClick, onDeleteUserClick}) => {
  const dispatch = useDispatch();
  const users = useUsers();
  const [currentUser, setCurrentUser] = useState<DetailedUserData>({
    firstName: '',
    lastName: '',
    room: null,
    appGroups: []
  })
  const [isUserDataLoading, setIsUserDataLoading] = useState(true)
  const [firstNameValue, setFirstNameValue] = useState('')
  const [lastNameValue, setLastNameValue] = useState('')
  const [isEditFormOpened, setIsEditFormOpened] = useState(false)

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

      setFirstNameValue(response.data.first_name)
      setLastNameValue(response.data.last_name)
      setIsUserDataLoading(false)
    } catch(e) {
      throw e
    }
  }

  const putUser = async () => {
    try {
      await axios(`https://specializedcampbeta.roxmiv.com/api/users/${id}`, {
        method: 'PATCH',
        data: {
          first_name: firstNameValue,
          last_name: lastNameValue
        }
      })
      

      const updatedData: DetailedUserData = {
        firstName: firstNameValue,
        lastName: lastNameValue,
        room: currentUser?.room,
        appGroups: currentUser?.appGroups
      }
      setCurrentUser(updatedData);
      dispatch(setIsUserChangedAction(true))
      toast.success("Информация обновлена успешно!");
    } catch(e) {
      throw e
    }
  }

  const deleteUser = async () => {
    try {
      await axios(`https://specializedcampbeta.roxmiv.com/api/users/${id}`, {
        method: 'DELETE'
      })
      toast.success("Участник успешно удален!");
      dispatch(setUsersAction(users.filter(user => user.id !== id)));
      dispatch(setIsUserChangedAction(true))
    } catch(e) {
      throw e
    } finally {
      onDeleteUserClick();
    }
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    putUser()
    setIsEditFormOpened(false)
  }

  // const handleDeleteButtonClick = () => {
  //   deleteUser();
  //   onDeleteUserClick();
  // }

  React.useEffect(() => {
    getDetailedUser();
  }, [])

  return (
    <div className={styles.detailed}>
      {isUserDataLoading ? <div className={styles.loader__wrapper}>
                <Loader className={styles.loader} size='l' />
            </div>
      : <>
        {!isEditFormOpened ? <>
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
            <EditIcon onClick={() => setIsEditFormOpened(true)}/>
            <BasketIcon onClick={() => deleteUser()}/>
          </div>
          <Button onClick={onBackButtonClick} className={styles.detailed__btn}>Назад</Button>
        </div>
        </>
        : <>
            <Form onSubmit={(event: React.FormEvent<HTMLFormElement>) => handleFormSubmit(event)} className={styles['form']}>
          <h3 className={styles.modal__title}>Заполните данные</h3>
          <Form.Control onChange={(event: ChangeEvent<HTMLInputElement>) => setFirstNameValue(event.target.value)} value={firstNameValue} type="text" placeholder="Имя*" className={`${styles.form__input} ${styles.form__item}`} />

          <Form.Control onChange={(event: ChangeEvent<HTMLInputElement>) => setLastNameValue(event.target.value)} value={lastNameValue} type="text" placeholder="Фамилия*" className={`${styles.form__input} ${styles.form__item}`} />
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Button className={styles.modal__btn} disabled={firstNameValue && lastNameValue ? false : true} type='submit'>Сохранить</Button>
            <Button className={styles.modal__btn} onClick={() => setIsEditFormOpened(false)}>Назад</Button>
          </div>
          </Form>
          </>  
      }
      </>}
    </div>
  )
}

export default DetailedInfo