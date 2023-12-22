import React, { useState, ChangeEvent } from 'react'
import styles from './ SettlementPage.module.scss'
import axios from 'axios'
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useBuildings, setBuildingsAction } from 'slices/BuildingsSlice';
import { setGroupsAction, setUsersWithoutRoomAction, useUsers, useUsersWithoutRoom } from 'slices/GroupsSlice';
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
import { RecBuildingData, RecGroupsData, RecRoomData, UserData, RecUserData, RecPublicPlacesData } from '../../../types';
import {API_URL} from 'components/urls';

const BuildingsPage = () => {
  const dispatch = useDispatch()
  const buildings = useBuildings()
  const usersWithoutRoom = useUsersWithoutRoom()
  const [groupValue, setGroupValue] = useState<RecGroupsData>()
  const [buildingValue, setBuildingValue] = useState<RecBuildingData>()
  const [currentRooms, setCurrentRooms] = useState<RecRoomData[]>()
  const [currentPlaces, setCurrentPlaces] = useState<RecPublicPlacesData[]>()
  const [newPlaceNameValue, setNewPlaceNameValue] = useState('')
  const [placeValue, setPlaceValue] = useState<RecPublicPlacesData | null>()
  const [isCreatePlaceModalOpened, setIsCreatePlaceModalOpened] = useState(false)
  const [isEditPlaceModalOpened, setIsEditPlaceModalOpened] = useState(false)
  const [isDeletePlaceModalOpened, setIsDeletePlaceModalOpened] = useState(false)
  const [isPlacesLoading, setIsPlacesLoading] = useState(false)
  const [usersFromRoom, setUsersFromRoom] = useState<UserData[]>()
  const [roomValue, setRoomValue] = useState<RecRoomData | null>()
  const [newBuildingValue, setNewBuildingValue] = useState('')
  const [newRoomNumberValue, setNewRoomNumberValue] = useState('')
  const [newRoomCapacityValue, setNewRoomCapacityValue] = useState('')
  const [addedUsers, setAddedUsers] = useState<number[]>([])
  const [deletedUsers, setDeletedUsers] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRoomsLoding, setIsRoomsLoading] = useState(false)
  const [isUsersLoading, setIsUsersLoading] = useState(false)
  const [isCreateBuildingModalOpened, setIsCreateBuildingModalOpened] = useState(false)
  const [isEditBuildingModalOpened, setIsEditBuildingModalOpened] = useState(false)
  const [isDeleteBuildingModalOpened, setIsDeleteBuildingModalOpened] = useState(false)
  const [isCreateRoomModalOpened, setIsCreateRoomModalOpened] = useState(false)
  const [isEditRoomModalOpened, setIsEditRoomModalOpened] = useState(false)
  const [isDeleteRoomModalOpened, setIsDeleteRoomModalOpened] = useState(false)
  const [isValid, setIsValid] = useState(true)

  const getBuildings = async () => {
    try {
      const response = await axios(API_URL + 'buildings', {
        method: 'GET'
      })
      dispatch(setBuildingsAction(response.data))

      if (!buildingValue) {
        setBuildingValue(response.data[0])
      }
      setIsRoomsLoading(true)
      setIsPlacesLoading(true)
      getRoomsFromBuilding(response.data[0].id)
      getPlacesFromBuilding(response.data[0].id)

    } catch(e) {
      throw e
    }
  }

  const getRoomsFromBuilding = async (id: number) => {
    try {
      const response = await axios(API_URL + `buildings/${id}/rooms`, {
        method: 'GET'
      })

      if (response.data.length > 0) {
        getUsersFromRoom(id, response.data[0].id)
        setCurrentRooms(response.data)
        setRoomValue(response.data[0])
      } else {
        setCurrentRooms([])
        setRoomValue(null)
      }
     
      setIsRoomsLoading(false)
    } catch(e) {
      throw e
    }
  }

  const getPlacesFromBuilding = async (id: number) => {
    try {
      const response = await axios(API_URL + `buildings/${id}/public_places`, {
        method: 'GET'
      })

      if (response.data.length > 0) {
        setCurrentPlaces(response.data)
        setPlaceValue(response.data[0])
      } else {
        setCurrentPlaces([])
        setPlaceValue(null)
      }
     
      setIsPlacesLoading(false)
    } catch(e) {
      throw e
    }
  }

  const getUsersWithoutRoom = async () => {
    try {
      const response = await axios(API_URL + `users/without_rooms`, {
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

    } catch(e) {
      throw e
    }
  }

  const getUsersFromRoom = async (buildingId: number, roomId: number) => {
    try {
      const response = await axios(API_URL + `buildings/${buildingId}/rooms/${roomId}/users`, {
        method: 'GET'
      })

      const newArr = response.data.map((row: RecUserData) => {
        return {
          id: row.id,
          firstName: row.first_name,
          lastName: row.last_name
        }
      })

      console.log('запрос пользователей из комнат', newArr)

      setUsersFromRoom(newArr)

    } catch (e){
      throw e
    } finally {
      setIsUsersLoading(false);
    }
  }

  const addUsersToRoom = async () => {
    try {
      await axios(API_URL + `buildings/${buildingValue?.id}/rooms/${roomValue?.id}/add_users`, {
        method: 'PATCH',
        data: addedUsers
      })
      clearData()
    } catch {

    } finally {
        toast.success("Информация о комнате успешно обновлена!");
        await Promise.all([
          getUsersWithoutRoom(),
          buildingValue && roomValue ? getUsersFromRoom(buildingValue.id, roomValue.id) : null
        ]);
        
        setIsLoading(false);
    }
  }

  const deleteUsersFromRoom = async () => {
    try {
      await axios(API_URL + `buildings/${buildingValue?.id}/rooms/${roomValue?.id}/remove_users`, {
        method: 'PATCH',
        data: deletedUsers
      })
      clearData()
    } catch {

    } finally {
        toast.success("Информация о комнате успешно обновлена!");
        getUsersWithoutRoom()
        if (buildingValue && roomValue) {
          getUsersFromRoom(buildingValue.id, roomValue.id)
        }
    }
  }

  const getGroups = async () => {
    try {
      const response = await axios(API_URL + `groups`, {
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
      const response = await axios(API_URL + 'buildings', {
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
      const response = await axios(API_URL + `buildings/${buildingValue?.id}`, {
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
      await axios(API_URL + `buildings/${buildingValue?.id}`, {
        method: 'DELETE'
      })

      const newArr = buildings.filter((building) => {
        return building.id !== buildingValue?.id
      })
      
      dispatch(setBuildingsAction(newArr))
      toast.success("Здание успешно удалено!");
      if (newArr.length > 0) {
        setBuildingValue(newArr[0])
        getRoomsFromBuilding(newArr[0].id)
        getPlacesFromBuilding(newArr[0].id)
      }
    } catch(e) {
      throw e
    }
  }

  const postRoom = async () => {
    try {
      const response = await axios(API_URL + `buildings/${buildingValue?.id}/rooms`, {
        method: 'POST',
        data: {
          number: Number(newRoomNumberValue),
          capacity: Number(newRoomCapacityValue)
        }
      })

      setRoomValue(response.data)
      if (buildingValue) {
        setIsUsersLoading(true)
        getUsersFromRoom(buildingValue?.id, response.data.id)
        getUsersWithoutRoom()
      }
      toast.success("Комната успешно добавлена!");
      if (currentRooms) {
        setCurrentRooms([...currentRooms, response.data])
      }
    } catch {
      toast.error("Комната с таким номером уже существует!");
    }
  }

  const putRoom = async () => {
    try {
      const response = await axios(API_URL + `buildings/${buildingValue?.id}/rooms/${roomValue?.id}`, {
        method: 'PUT',
        data: {
          number: Number(newRoomNumberValue),
          capacity: Number(newRoomCapacityValue)
        }
      })

      const updatedRooms = currentRooms?.map(room => {
        if (room.id === roomValue?.id) {
          return {
            ...room,
            number: Number(newRoomNumberValue),
            capacity: Number(newRoomCapacityValue)
          };
        }
        return room;
      });

      setCurrentRooms(updatedRooms)
      setRoomValue(response.data)
      toast.success("Информация успешно обновлена!");
    } catch {
      toast.error("Комната с таким номером уже существует!");
    }
  }

  const deleteRoom = async () => {
    try {
      await axios(API_URL + `buildings/${buildingValue?.id}/rooms/${roomValue?.id}`, {
        method: 'DELETE'
      })

      const newArr = currentRooms?.filter(room => {
        return room.id !== roomValue?.id
      })

      setCurrentRooms(newArr)
      if (newArr?.length !== 0 && newArr) {
        setRoomValue(newArr[0])
        if (buildingValue && roomValue) {
          setIsUsersLoading(true)
          getUsersFromRoom(buildingValue.id, newArr[0].id)
          // getUsersFromRoom(buildingValue.id, roomValue.id)
        }
      } else {
        setRoomValue(undefined)
      }
      toast.success("Комната успешно удалена!");
    } catch {

    } finally {
      // if (buildingValue?.id && roomValue?.id) {
      //   setIsUsersLoading(true)
      //   getUsersFromRoom(buildingValue.id, roomValue.id)
      // }
    }
  }

  const postPlace = async () => {
    try {
      const response = await axios(API_URL + `buildings/${buildingValue?.id}/public_places`, {
        method: 'POST',
        data: {
          name: newPlaceNameValue
        }
      })

      setPlaceValue(response.data)
      toast.success("Помещение успешно добавлено!");
      if (currentPlaces) {
        setCurrentPlaces([...currentPlaces, response.data])
      }
    } catch {
      toast.error("Помещение с таким названием уже существует!");
    }
  }

  const putPlace = async () => {
    try {
      const response = await axios(API_URL + `buildings/${buildingValue?.id}/public_places/${placeValue?.id}`, {
        method: 'PUT',
        data: {
          name: newPlaceNameValue
        }
      })

      const updatedPlaces = currentPlaces?.map(place => {
        if (place.id === placeValue?.id) {
          return {
            ...place,
            name: newPlaceNameValue,
          };
        }
        return place;
      });

      setCurrentPlaces(updatedPlaces)
      setPlaceValue(response.data)
      toast.success("Информация успешно обновлена!");
    } catch {
      toast.error("Помещение с таким названием уже существует!");
    }
  }

  const deletePlace = async () => {
    try {
      await axios(API_URL + `buildings/${buildingValue?.id}/public_places/${placeValue?.id}`, {
        method: 'DELETE'
      })

      const newArr = currentPlaces?.filter(place => {
        return place.id !== placeValue?.id
      })

      setCurrentPlaces(newArr)
      if (newArr?.length !== 0 && newArr) {
        setPlaceValue(newArr[0])
      } else {
        setPlaceValue(undefined)
      }
      toast.success("Помещение успешно удалено!");
    } catch {

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

  React.useEffect(() => {

  }, [])

  const handleBuildingFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isCreateBuildingModalOpened) {
      postBuilding();
    } else {
      putBuilding()
    }
    setNewBuildingValue('')
    setIsCreateBuildingModalOpened(false)
    setIsEditBuildingModalOpened(false)
  }

  const handleRoomFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isCreateRoomModalOpened) {
      postRoom();
    } else {
      putRoom()
    }
    setNewRoomCapacityValue('')
    setNewRoomNumberValue('')
    setIsCreateRoomModalOpened(false)
    setIsEditRoomModalOpened(false)
  }

  const handlePlaceFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isCreatePlaceModalOpened) {
      postPlace();
    } else {
      putPlace()
    }
    setNewPlaceNameValue('')
    setIsCreatePlaceModalOpened(false)
    setIsEditPlaceModalOpened(false)
  }

  const handleBuildingSelect = (eventKey: string | null) => {
    if (eventKey !== null) {
      const selectedBuilding = buildings.find(building => building.id === parseInt(eventKey, 10));
      if (selectedBuilding && selectedBuilding.id !== buildingValue?.id) {
        setBuildingValue(selectedBuilding)
        getRoomsFromBuilding(selectedBuilding.id)
        getPlacesFromBuilding(selectedBuilding.id)
      }
    }
  };

  const handleRoomSelect = async (eventKey: string | null) => {
    if (eventKey !== null) {
      const selectedRoom = currentRooms?.find(room => room.id === parseInt(eventKey, 10));
      if (selectedRoom && selectedRoom.id !== roomValue?.id) {
        setRoomValue(selectedRoom)
        if (buildingValue) {
          setIsLoading(true);
          await getUsersFromRoom(buildingValue?.id, Number(eventKey));
          setIsLoading(false);
        }
      }
    }
    
   };

  const handlePlaceSelect = (eventKey: string | null) => {
    if (eventKey !== null) {
      const selectedPlace = currentPlaces?.find(place => place.id === parseInt(eventKey, 10));
      if (selectedPlace && selectedPlace.id !== placeValue?.id) {
        setPlaceValue(selectedPlace)
      }
    }
  };

  const handleEditBuildingButtonClick = () => {
    setIsEditBuildingModalOpened(true);
    if (buildingValue) {
      setNewBuildingValue(buildingValue.name)
    }
  }
  
  const handleEditRoomButtonClick = () => {
    setIsEditRoomModalOpened(true);
    if (roomValue) {
      setNewRoomNumberValue((roomValue.number).toString())
      setNewRoomCapacityValue((roomValue.capacity).toString())
    }
  }

  const handleEditPlaceButtonClick = () => {
    setIsEditPlaceModalOpened(true);
    if (placeValue) {
      setNewPlaceNameValue(placeValue.name)
    }
  }

  const handleDeleteBuildingConfirmClick = () => {
    deleteBuilding();
    clearData(); 
    setIsDeleteBuildingModalOpened(false)
  }

  const handleDeleteRoomConfirmClick = () => {
    deleteRoom();
    clearData(); 
    setIsDeleteRoomModalOpened(false)
  }

  const handleDeletePlaceConfirmClick = () => {
    deletePlace();
    clearData(); 
    setIsDeletePlaceModalOpened(false)
  }

  const handleUserAdd = (id: number) => {
    if (addedUsers.includes(id)) {
      setAddedUsers(addedUsers.filter(userId => userId !== id));
    } else {
      setAddedUsers([...addedUsers, id]);
      if (usersFromRoom && roomValue && (addedUsers.length + 1 + usersFromRoom?.length > roomValue?.capacity)) {
        toast.error('В комнате не хватает мест!')
      }
    }
  };

  const handleUserDelete = (id: number) => {
    if (deletedUsers.includes(id)) {
      setDeletedUsers(deletedUsers.filter(userId => userId !== id));
    } else {
      setDeletedUsers([...deletedUsers, id]);
    }
  }
  
  const handleAddUsers = () => {
    if (addedUsers.length !== 0) {
      setIsUsersLoading(true)
      addUsersToRoom()
    }
  }

  const handleDeleteUsers = () => {
    if (deletedUsers.length !== 0) {
      setIsUsersLoading(true)
      deleteUsersFromRoom()
    }
  }

  const clearData = () => {
    setAddedUsers([])
    setDeletedUsers([])
  }

  return (
    <div className={styles.settlement__page}>
        <div className={styles['settlement__page-wrapper']}>
          <h1 className={styles['settlement__page-title']}>Помещения и расселение</h1>
          {isLoading ? <div className={styles.loader__wrapper}>
              <Loader className={styles.loader} size='l' />
          </div>
          : <div className={styles['settlement__page-content']}>
            <div className={styles['settlement__page-dropdowns']}>
              <div className={styles.dropdown__wrapper}>
                <div className={styles.dropdown__content}>
                  <h4 className={styles['settlement__page-subtitle']}>Здания</h4>
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
                  <AddButton onClick={() => {setIsCreateBuildingModalOpened(true); clearData()}}/>
                  <EditIcon onClick={handleEditBuildingButtonClick}/>
                  <BasketIcon onClick={() => setIsDeleteBuildingModalOpened(true)}/>
                </div>
              </div>
              {/* <div className={styles['settlement__page-content-action']}> */}
              { placeValue ? <div className={styles.dropdown__wrapper}>
                  <div className={styles.dropdown__content}>
                    <h4 className={styles['settlement__page-subtitle']}>Помещения</h4>
                    <Dropdown className={styles['dropdown']} onSelect={handlePlaceSelect}>
                      <Dropdown.Toggle
                          className={styles['dropdown__toggle']}
                          style={{
                              borderColor: '#000',
                              backgroundColor: "#fff",
                              color: '#000',
                          }}
                      >   
                        {placeValue?.name}
                        <ArrowDownIcon className={styles.dropdown__icon}/>
                      </Dropdown.Toggle>
                      {placeValue && <Dropdown.Menu className={styles['dropdown__menu']}>
                          {currentPlaces?.map(place => (
                              <Dropdown.Item className={styles['dropdown__menu-item']} key={place && place.id} eventKey={place.id}>{place.name}</Dropdown.Item>
                          ))}
                      </Dropdown.Menu>}
                    </Dropdown>
                  </div>
                  <div className={styles.dropdown__btns}>
                    <AddButton onClick={() => {setIsCreatePlaceModalOpened(true); clearData()}}/>
                    <EditIcon onClick={handleEditPlaceButtonClick}/>
                    <BasketIcon onClick={() => setIsDeletePlaceModalOpened(true)}/>
                  </div>
                </div>
                : !isPlacesLoading && <div>
                  <div className={styles['settlement__page-dropdowns-empty']}>
                    <h5 className={styles['settlement__page-text']}>Хотите добавить помещение?</h5>
                    <div className={styles.dropdown__btns}>
                      <AddButton className={styles['settlement__page-dropdowns-btn']} onClick={() => {setIsCreatePlaceModalOpened(true); clearData()}}/>
                    </div>
                  </div>
              </div>  
              }
              { roomValue ? <div className={styles.dropdown__wrapper}>
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
                    <AddButton onClick={() => {setIsCreateRoomModalOpened(true); clearData()}}/>
                    <EditIcon onClick={handleEditRoomButtonClick}/>
                    <BasketIcon onClick={() => setIsDeleteRoomModalOpened(true)}/>
                  </div>
                </div>
                : !isRoomsLoding && <div>
                  {/* <h4 className={styles['settlement__page-subtitle']}>В этом здании комнаты не добавлены</h4> */}
                  <div className={styles['settlement__page-dropdowns-empty']}>
                  <h5 className={styles['settlement__page-text']}>Хотите добавить комнату?</h5>
                    <div className={styles.dropdown__btns}>
                      <AddButton className={styles['settlement__page-dropdowns-btn']} onClick={() => {setIsCreateRoomModalOpened(true); clearData()}}/>
                    </div>
                  </div>
              </div>  
              }
            {/* </div> */}
            </div>
            {roomValue && !isUsersLoading ? <div className={styles['settlement__page-actions']}>
              <div className={styles['settlement__page-item']}>
                <h4 className={styles['settlement__page-subtitle']}>Доступные участники</h4>
                <SearchList onMemberClick={handleUserAdd} activeMembers={addedUsers} areUsersWithoutRooms members={usersWithoutRoom}/>
                <p>Выбрано: {addedUsers.length}</p>
              </div>
              <div className={styles['settlement__page-actions-btns']}>
                <Button className={styles['settlement__page-actions-common']} disabled={usersFromRoom && (usersFromRoom.length + addedUsers.length > roomValue.capacity)} onClick={handleAddUsers}><ArrowIcon/></Button>
                <Button onClick={handleDeleteUsers} className={styles['settlement__page-actions-reverse']}><ArrowIcon/></Button>
              </div>
              <div className={styles['settlement__page-item']}>
                <h4 className={styles['settlement__page-subtitle']}>Вместимость: {roomValue?.capacity}</h4>
                <SearchList onMemberClick={handleUserDelete} activeMembers={deletedUsers} members={usersFromRoom}/>
                <p>Выбрано: {deletedUsers.length}</p>
              </div>
            </div>
            : roomValue && <div className={styles.loader__wrapper}>
                <Loader className={styles.loader} size='l' />
              </div>
            } 
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
          <h3 className={styles.modal__title}>Вы уверены, что хотите удалить данное здание?</h3>
          <div className={styles['modal__delete-btns']}>
            <Button onClick={handleDeleteBuildingConfirmClick} className={styles.modal__btn}>Подтвердить</Button>
            <Button onClick={() => setIsDeleteBuildingModalOpened(false)} className={styles.modal__btn}>Закрыть</Button>
          </div>
        </ModalWindow>

        <ModalWindow handleBackdropClick={() => {setIsCreateRoomModalOpened(false); setIsEditRoomModalOpened(false); newRoomCapacityValue && setNewRoomCapacityValue(''); newRoomNumberValue && setNewRoomNumberValue('')}}
        className={styles.modal} active={isCreateRoomModalOpened || isEditRoomModalOpened}>
          <h3 className={styles.modal__title}>Заполните данные</h3>
          <Form onSubmit={(event: React.FormEvent<HTMLFormElement>) => handleRoomFormSubmit(event)}
          className={styles['form']}>
            <div className={styles.form__item}>
              <Form.Control onChange={(event: ChangeEvent<HTMLInputElement>) => {setNewRoomNumberValue(event.target.value); isNaN(Number(event.target.value)) ? setIsValid(false) : setIsValid(true)}} value={newRoomNumberValue} className={styles.form__input} type="text" placeholder="Номер комнаты*" />
            </div>
            <div className={styles.form__item}>
              <Form.Control onChange={(event: ChangeEvent<HTMLInputElement>) => {setNewRoomCapacityValue(event.target.value); isNaN(Number(event.target.value)) ? setIsValid(false) : setIsValid(true)}} value={newRoomCapacityValue} className={styles.form__input} type="text" placeholder="Вместимость*" />
            </div>
            <Button disabled={newRoomCapacityValue && newRoomNumberValue && isValid ? false : true} type='submit'>Сохранить</Button>
            {isValid ? <p style={{opacity: 0}} className={styles.modal__error}>Поля должны быть числовыми!</p>
            : <p className={styles.modal__error}>Поля должны быть числовыми!</p>
          }
          </Form>
        </ModalWindow>

        <ModalWindow handleBackdropClick={() => setIsDeleteRoomModalOpened(false)} active={isDeleteRoomModalOpened} className={styles.modal}>
          <h3 className={styles.modal__title}>Вы уверены, что хотите удалить данную комнату?</h3>
          <div className={styles['modal__delete-btns']}>
            <Button onClick={handleDeleteRoomConfirmClick} className={styles.modal__btn}>Подтвердить</Button>
            <Button onClick={() => setIsDeleteRoomModalOpened(false)} className={styles.modal__btn}>Закрыть</Button>
          </div>
        </ModalWindow>

        <ModalWindow handleBackdropClick={() => {setIsCreatePlaceModalOpened(false); setIsEditPlaceModalOpened(false); newPlaceNameValue && setNewPlaceNameValue('')}}
        className={styles.modal} active={isCreatePlaceModalOpened || isEditPlaceModalOpened}>
          <h3 className={styles.modal__title}>Заполните данные</h3>
          <Form onSubmit={(event: React.FormEvent<HTMLFormElement>) => handlePlaceFormSubmit(event)}
          className={styles['form']}>
            <div className={styles.form__item}>
              <Form.Control onChange={(event: ChangeEvent<HTMLInputElement>) => {setNewPlaceNameValue(event.target.value); }} value={newPlaceNameValue} className={styles.form__input} type="text" placeholder="Название*" />
            </div>
            <Button disabled={newPlaceNameValue  ? false : true} type='submit'>Сохранить</Button>
            {isValid ? <p style={{opacity: 0}} className={styles.modal__error}>Поля должны быть числовыми!</p>
            : <p className={styles.modal__error}>Поля должны быть числовыми!</p>
          }
          </Form>
        </ModalWindow>

        <ModalWindow handleBackdropClick={() => setIsDeletePlaceModalOpened(false)} active={isDeletePlaceModalOpened} className={styles.modal}>
          <h3 className={styles.modal__title}>Вы уверены, что хотите удалить данное помещение?</h3>
          <div className={styles['modal__delete-btns']}>
            <Button onClick={handleDeletePlaceConfirmClick} className={styles.modal__btn}>Подтвердить</Button>
            <Button onClick={() => setIsDeletePlaceModalOpened(false)} className={styles.modal__btn}>Закрыть</Button>
          </div>
        </ModalWindow>
    </div>
  )
}

export default BuildingsPage