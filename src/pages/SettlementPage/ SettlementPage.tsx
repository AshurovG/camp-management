import React, { useState, ChangeEvent } from 'react'
import styles from './ SettlementPage.module.scss'
import axios from 'axios'
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useBuildings, setBuildingsAction } from 'slices/BuildingsSlice';
import { useGroups, useUsersWithoutRoom, setGroupsAction, setUsersWithoutRoomAction, useIsUserChanged } from 'slices/GroupsSlice';
import Button from 'components/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import ArrowDownIcon from 'components/Icons/ArrowDownIcon';
import ModalWindow from 'components/ModalWindow';
import SearchList from 'components/SearchList';
import ArrowIcon from 'components/Icons/ArrowIcon';
import BasketIcon from 'components/Icons/BasketIcon';
import EditIcon from 'components/Icons/EditIcon';
import AddButton from 'components/Icons/AddButton';
import Loader from 'components/Loader';
import { RecBuildingData, RecGroupsData, RecRoomData, UserData, RecUserData } from '../../../types';

const BuildingsPage = () => {
  const dispatch = useDispatch()
  const groups = useGroups()
  const usersWithoutRooms = useUsersWithoutRoom()
  const buildings = useBuildings()
  const [groupValue, setGroupValue] = useState<RecGroupsData>()
  const [buildingValue, setBuildingValue] = useState<RecBuildingData>()
  const [currentRooms, setCurrentRooms] = useState<RecRoomData[]>()
  const [usersFromRoom, setUsersFromRoom] = useState<UserData[]>()
  // const [usersWithoutRooms, setUsersWithoutRooms] = useState<UserData[]>()
  const [roomValue, setRoomValue] = useState<RecRoomData>()
  const [newBuildingValue, setNewBuildingValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCreateBuildingModalOpened, setIsCreateBuildingModalOpened] = useState(false)
  const [isEditBuildingModalOpened, setIsEditBuildingModalOpened] = useState(false)
  const [isDeleteBuildingModalOpened, setIsDeleteBuildingModalOpened] = useState(false)

  const getBuildings = async () => {
    try {
      const response = await axios('https://specializedcampbeta.roxmiv.com/api/buildings', {
        method: 'GET'
      })
      console.log(response.data)
      dispatch(setBuildingsAction(response.data))

      if (!buildingValue) {
        setBuildingValue(response.data[0])
      }

      getRoomsFromBuilding(response.data[0].id)

    } catch(e) {
      throw e
    }
  }

  const getRoomsFromBuilding = async (id: number) => {
    try {
      const response = await axios(`https://specializedcampbeta.roxmiv.com/api/buildings/${id}/rooms`, {
        method: 'GET'
      })

      console.log(response.data)

      setCurrentRooms(response.data)
      setRoomValue(response.data[0])
    } catch(e) {
      throw e
    }
  }

  const getUsersWithoutRoom = async () => {
    try {
      const response = await axios(`https://specializedcampbeta.roxmiv.com/api/users/without_rooms`, {
        method: 'GET'
      })

      const newArr = response.data.map((user: RecUserData) => {
        return {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name
        }
      })

      dispatch(setUsersWithoutRoomAction(newArr))

      console.log(`newarr is ${newArr}`)
    } catch(e) {
      throw e
    }
  }

  const getGroups = async () => {
    try {
      const response = await axios(`https://specializedcampbeta.roxmiv.com/api/groups`, {
        method: 'GET'
      })
      dispatch(setGroupsAction(response.data))
      if (!groupValue) {
        setGroupValue(response.data[0])
      }
    } catch(e) {
      throw e
    }
  }

  const postBuilding = async () => {
    try {
      const response = await axios('https://specializedcampbeta.roxmiv.com/api/buildings', {
        method: 'POST',
        data: {
          "name": newBuildingValue
        }
      })

      dispatch(setBuildingsAction([...buildings, response.data]))
      toast.success("Здание успешно добавлено!");
    } catch {
      toast.error("Здание с таким названием уже существует!");
    }
  }

  const putBuilding = async () => {
    try {
      const response = await axios(`https://specializedcampbeta.roxmiv.com/api/buildings/${buildingValue?.id}`, {
        method: 'PUT',
        data: {
          "name": newBuildingValue
        }
      })

      const updatedBuildings = buildings.map(building => {
        if (building.id === buildingValue?.id) {
          return {
            ...building,
            name: newBuildingValue
          };
        }
        return building;
      });
      dispatch(setBuildingsAction(updatedBuildings));
      setBuildingValue(response.data)
      toast.success("Информация успешно обновлена!");
    } catch {
      toast.error("Здание с таким названием уже существует!");
    }
  }

  const deleteBuilding = async () => {
    try {
      await axios(`https://specializedcampbeta.roxmiv.com/api/buildings/${buildingValue?.id}`, {
        method: 'DELETE'
      })

      const newArr = buildings.filter((building) => {
        return building.id !== buildingValue?.id
      })
      
      dispatch(setBuildingsAction(newArr))
      toast.success("Здание успешно удалено!");
      if (newArr.length !== 0) {
        setBuildingValue(newArr[0])
      }
    } catch(e) {
      throw e
    }
  }

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([getBuildings(), getGroups(), getUsersWithoutRoom()]);
      } catch (e) {
        throw e
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const handleBuildingFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isCreateBuildingModalOpened) {
      postBuilding();
    } else {
      console.log('put')
      putBuilding()
    }
    setNewBuildingValue('')
    setIsCreateBuildingModalOpened(false)
    setIsEditBuildingModalOpened(false)
  }

  const handleBuildingSelect = (eventKey: string | null) => {
    if (eventKey !== null) {
      const selectedBuilding = buildings.find(building => building.id === parseInt(eventKey, 10));
      if (selectedBuilding && selectedBuilding.id !== buildingValue?.id) {
        setBuildingValue(selectedBuilding)
        getRoomsFromBuilding(selectedBuilding.id)
      }
    }
  };

  const handleRoomSelect = (eventKey: string | null) => {
    if (eventKey !== null) {
      const selectedRoom = currentRooms?.find(room => room.id === parseInt(eventKey, 10));
      if (selectedRoom && selectedRoom.id !== roomValue?.id) {
        setRoomValue(selectedRoom)
      }
    }
  };

  const handleEditButtonClick = () => {
    setIsEditBuildingModalOpened(true);
    if (buildingValue) {
      setNewBuildingValue(buildingValue.name)
    }
  }

  const handleDeleteConfirmClick = () => {
    deleteBuilding();
    // clearData(); 
    setIsDeleteBuildingModalOpened(false)
  }

  

  return (
    <div className={styles.settlement__page}>
        <div className={styles['settlement__page-wrapper']}>
          <h1 className={styles['settlement__page-title']}>Расселение участников лагеря</h1>
          {isLoading ? <div className={styles.loader__wrapper}>
              <Loader className={styles.loader} size='l' />
          </div>
          : <div className={styles['settlement__page-content']}>
            <div className={styles['settlement__page-dropdowns']}>
              <div className={styles.dropdown__wrapper}>
                <div className={styles.dropdown__content}>
                  <h4 className={styles['settlement__page-subtitle']}>Группы</h4>
                  <Dropdown className={styles['dropdown']} onSelect={handleBuildingSelect}>
                    <Dropdown.Toggle
                        className={styles['dropdown__toggle']}
                        style={{
                            borderColor: '#000',
                            backgroundColor: "#fff",
                            color: '#000',
                        }}
                    >   
                      {buildingValue?.name}
                      <ArrowDownIcon className={styles.dropdown__icon}/>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className={styles['dropdown__menu']}>
                        {buildings.map(building => (
                            <Dropdown.Item className={styles['dropdown__menu-item']} key={building.id} eventKey={building.id}>{building.name}</Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div className={styles.dropdown__btns}>
                  <AddButton onClick={() => setIsCreateBuildingModalOpened(true)}/>
                  <EditIcon onClick={handleEditButtonClick}/>
                  <BasketIcon onClick={() => setIsDeleteBuildingModalOpened(true)}/>
                </div>
              </div>
              
              <div className={styles.dropdown__wrapper}>
                <div className={styles.dropdown__content}>
                  <h4 className={styles['settlement__page-subtitle']}>Комнаты</h4>
                  <Dropdown className={styles['dropdown']} onSelect={handleRoomSelect}>
                    <Dropdown.Toggle
                        className={styles['dropdown__toggle']}
                        style={{
                            borderColor: '#000',
                            backgroundColor: "#fff",
                            color: '#000',
                        }}
                    >   
                      {roomValue ? <>Комната №</> : <>Комнат нет</>} {roomValue?.number}
                      <ArrowDownIcon className={styles.dropdown__icon}/>
                    </Dropdown.Toggle>
                    {roomValue && <Dropdown.Menu className={styles['dropdown__menu']}>
                        {currentRooms?.map(room => (
                            <Dropdown.Item className={styles['dropdown__menu-item']} key={room && room.id} eventKey={room.id}>Комната № {room.number}</Dropdown.Item>
                        ))}
                    </Dropdown.Menu>}
                  </Dropdown>
                </div>
                <div className={styles.dropdown__btns}>
                  <AddButton onClick={() => {}}/>
                  <EditIcon onClick={() => {}}/>
                  <BasketIcon onClick={() => {}}/>
                </div>
              </div>
            </div>
            <div className={styles['settlement__page-actions']}>
              <div className={styles['settlement__page-item']}>
              <h4 className={styles['settlement__page-subtitle']}>Вместимость: {roomValue?.capacity}</h4>
                <SearchList areUsersWithoutRooms/>
              </div>
              <div className={styles['settlement__page-actions-btns']}>
                <Button onClick={() => {}}><ArrowIcon/></Button>
                <Button onClick={() => {}} className={styles['settlement__page-actions-reverse']}><ArrowIcon/></Button>
              </div>
              <SearchList areUsersWithoutRooms/>
            </div>   
          </div>}
        </div>

        <ModalWindow handleBackdropClick={() => {setIsCreateBuildingModalOpened(false); setIsEditBuildingModalOpened(false); newBuildingValue && setNewBuildingValue('')}} className={styles.modal} active={isCreateBuildingModalOpened || isEditBuildingModalOpened}>
          <h3 className={styles.modal__title}>Заполните данные</h3>
          <Form onSubmit={(event: React.FormEvent<HTMLFormElement>) => handleBuildingFormSubmit(event)}
          className={styles['form']}>
            <div className={styles.form__item}>
            <Form.Control onChange={(event: ChangeEvent<HTMLInputElement>) => setNewBuildingValue(event.target.value)} value={newBuildingValue} className={styles.form__input} type="text" placeholder="Название*" />
            </div>
            <Button disabled={newBuildingValue ? false : true} type='submit'>Сохранить</Button>
          </Form>
      </ModalWindow>

      <ModalWindow handleBackdropClick={() => setIsDeleteBuildingModalOpened(false)} active={isDeleteBuildingModalOpened} className={styles.modal}>
        <h3 className={styles.modal__title}>Вы уверены, что хотите удалить данную группу?</h3>
        <div className={styles['modal__delete-btns']}>
          <Button onClick={handleDeleteConfirmClick} className={styles.modal__btn}>Подтвердить</Button>
          <Button onClick={() => setIsDeleteBuildingModalOpened(false)} className={styles.modal__btn}>Закрыть</Button>
        </div>
      </ModalWindow>
    </div>
  )
}

export default BuildingsPage