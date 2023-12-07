import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
import styles from './GroupsPage.module.scss'
import { useDispatch } from 'react-redux';
import { useGroups, setGroupsAction } from 'slices/GroupsSlice';
import AddButton from 'components/Icons/AddButton';
import Button from 'components/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import ArrowDownIcon from 'components/Icons/ArrowDownIcon';
import BasketIcon from 'components/Icons/BasketIcon';
import EditIcon from 'components/Icons/EditIcon';
import ModalWindow from 'components/ModalWindow';
import Form from 'react-bootstrap/Form';
import { RecGroupsData } from '../../../types';

const GroupsPage = () => {
  const dispatch = useDispatch();
  const groups = useGroups(); 
  const [groupValue, setGroupValue] = useState<RecGroupsData>()
  const [isAddModalWindowOpened, setIsAddModalWindowOpened] = useState(false)
  const [isEditModalWindowOpened, setIsEditModalWindowOpened] = useState(false)
  const [newGroupValue, setNewGroupValue] = useState('')

  const getGroups = async () => {
    try {
      const response = await axios(`https://specializedcampbeta.roxmiv.com/api/groups`)
      dispatch(setGroupsAction(response.data))
      setGroupValue(response.data[0])
    } catch(e) {
      throw e
    }
  }

  const postGroup = async () => {
    try {
      const response = await axios(`https://specializedcampbeta.roxmiv.com/api/groups`, {
        method: 'POST',
        data: {
          "name": newGroupValue
        }
      })
      dispatch(setGroupsAction([...groups, response.data]))
    } catch(e) {
      throw e
    }
  }

  const putGroup = async () => {
    try {
      const response = await axios(`https://specializedcampbeta.roxmiv.com/api/groups/${groupValue?.id}`, {
        method: 'PUT',
        data: {
          "name": newGroupValue
        }
      })
      const updatedGroups = groups.map(group => {
        if (group.id === groupValue?.id) {
          return {
            ...group,
            name: newGroupValue
          };
        }
        return group;
      });
      setGroupValue(response.data)
      dispatch(setGroupsAction(updatedGroups))
    } catch(e) {
      throw e
    }
  }

  const deleteGroup = async () => {
    try {
      const response = await axios(`https://specializedcampbeta.roxmiv.com/api/groups/${groupValue?.id}`, {
        method: 'DELETE'
      })
      dispatch(setGroupsAction(groups.filter(group => group.id !== groupValue?.id)));
      setGroupValue(groups[0])
    } catch(e) {
      throw e
    }
  }

  React.useEffect(() => {
    getGroups()
  }, [])


  const handleGroupSelect = (eventKey: string | null) => {
    if (eventKey !== null) {
      const selectedGroup = groups.find(group => group.id === parseInt(eventKey, 10));
      if (selectedGroup) {
        setGroupValue(selectedGroup)
      }
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isAddModalWindowOpened) {
      postGroup()
    } else {
      putGroup()
    }
    setNewGroupValue('')
    setIsAddModalWindowOpened(false)
    setIsEditModalWindowOpened(false)
  }

  const handleEditButtonClick = () => {
    setIsEditModalWindowOpened(true);
    if (groupValue) {
      setNewGroupValue(groupValue.name)
    }
  }

  return (
    <div className={styles.groups__page}>
        <div className={styles['groups__page-wrapper']}>
             <h1 className={styles['groups__page-title']}>Группы и участники</h1>
             <div className={styles['groups__page-action']}>
              <Dropdown className={styles['dropdown']} onSelect={handleGroupSelect}>
                  <Dropdown.Toggle
                      className={styles['dropdown__toggle']}
                      style={{
                          borderColor: '#000',
                          backgroundColor: "#fff",
                          color: '#000',
                      }}
                  >   
                      {groupValue?.name}
                      <ArrowDownIcon className={styles.dropdown__icon}/>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className={styles['dropdown__menu']}>
                      {groups.map(group => (
                          <Dropdown.Item className={styles['dropdown__menu-item']} key={group.id} eventKey={group.id}>{group.name}</Dropdown.Item>
                      ))}
                  </Dropdown.Menu>
              </Dropdown>
              <AddButton onClick={() => setIsAddModalWindowOpened(true)}/>
              <EditIcon onClick={handleEditButtonClick}/>
              <BasketIcon onClick={() => deleteGroup()}/>
             </div>
             <ModalWindow handleBackdropClick={() => {setIsAddModalWindowOpened(false); setIsEditModalWindowOpened(false)}} className={styles.modal} active={isAddModalWindowOpened || isEditModalWindowOpened}>
              <h3 className={styles.modal__title}>Заполните данные</h3>
              <Form onSubmit={(event: React.FormEvent<HTMLFormElement>) => handleFormSubmit(event)}
              className={styles['form']}>
                <div className={styles.form__item}>
                  <Form.Group style={{height: 50}} className='mb-3' controlId="search__sub.input__sub">
                    <Form.Control onChange={(event: ChangeEvent<HTMLInputElement>) => setNewGroupValue(event.target.value)} value={newGroupValue} style={{height: '100%', borderColor: '#3D348B', fontSize: 18}} type="text" placeholder="Название*" />
                  </Form.Group>
                </div>
                <Button type='submit'>Сохранить</Button>
              </Form>
            </ModalWindow>
        </div>
    </div>
  )
}

export default GroupsPage;