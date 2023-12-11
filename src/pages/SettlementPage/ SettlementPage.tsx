import React, { useState } from 'react'
import styles from './ SettlementPage.module.scss'
import axios from 'axios'
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useBuildings, setBuildingsAction } from 'slices/BuildingsSlice';
import { useGroups, useUsersWithoutRoom, setGroupsAction, setUsersWithoutRoomAction } from 'slices/GroupsSlice';
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
import { RecBuildingData, RecGroupsData, RecRoomData, UserData, RecUserData } from '../../../types';

const BuildingsPage = () => {
  const dispatch = useDispatch()
  const groups = useGroups()
  const usersWithoutRooms = useUsersWithoutRoom()
  const [groupValue, setGroupValue] = useState<RecGroupsData>()
  const [buildingValue, setBuildingValue] = useState<RecBuildingData>()
  const [currentRooms, setCurrentRooms] = useState<RecRoomData[]>()
  const [usersFromRoom, setUsersFromRoom] = useState<UserData[]>()
  // const [usersWithoutRooms, setUsersWithoutRooms] = useState<UserData[]>()
  const [roomValue, setRoomValue] = useState<RecRoomData>()
  const buildings = useBuildings()

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


  // const postBuilding = async () => {
  //   try {
  //     const response = await axios('https://specializedcampbeta.roxmiv.com/api/buildings', {
  //       method: 'POST',
  //       data: {
  //         "name": titleValue
  //       }
  //     })

  //     dispatch(setBuildingsAction([...buildings, response.data]))
  //   } catch(e) {
  //     throw(e)
  //   }
  // }

  // const putBuilding = async (id: number, title: string) => {
  //   try {
  //     const response = await axios(`https://specializedcampbeta.roxmiv.com/api/buildings/${id}`, {
  //       method: 'PUT',
  //       data: {
  //         "name": title
  //       }
  //     })

  //     dispatch(setBuildingsAction([...buildings, response.data]))
  //   } catch(e) {
  //     throw(e)
  //   }
  // }

  // const deleteBuilding = async (id: number) => {
  //   try {
  //     const response = await axios(`https://specializedcampbeta.roxmiv.com/api/buildings/${id}`, {
  //       method: 'DELETE'
  //     })
  //   } catch(e) {
  //     throw e
  //   }
  // }

  // React.useEffect(() => {
  //   // getBuildings()
  //   console.log(currentRooms[0], buildings[0])
  // }, [])

  // const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  // }

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

    // setIsAllGroupsLoading(false)
  }

  React.useEffect(() => {
    getBuildings();
    getGroups();
    getUsersWithoutRoom();
  }, [])

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

  

  return (
    <div className={styles.settlement__page}>
        <div className={styles['settlement__page-wrapper']}>
          <h1 className={styles['settlement__page-title']}>Расселение участников лагеря</h1>
          <div className={styles['settlement__page-content']}>
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
                  <AddButton onClick={() => {}}/>
                  <EditIcon onClick={() => {}}/>
                  <BasketIcon onClick={() => {}}/>
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
                      Комната № {roomValue?.number}
                      <ArrowDownIcon className={styles.dropdown__icon}/>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className={styles['dropdown__menu']}>
                        {currentRooms?.map(room => (
                            <Dropdown.Item className={styles['dropdown__menu-item']} key={room && room.id} eventKey={room.id}>Комната № {room.number}</Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
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
              <SearchList areUsersWithoutRooms></SearchList>
            </div>   
          </div>
        </div>
    </div>
  )
}

export default BuildingsPage