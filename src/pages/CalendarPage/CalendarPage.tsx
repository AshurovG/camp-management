import React, { useState, ChangeEvent } from 'react';
import moment from 'moment';
import 'moment/dist/locale/ru';
import styles from './CalendarPage.module.scss'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import DetailedEventInfo from 'components/DetailedEventInfo';
import ModalWindow from 'components/ModalWindow';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' 
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/ru';
import { useDispatch } from 'react-redux';
import { useCommon } from 'slices/MainSlice';
import axios from 'axios'
import { RecEventsData, EventsData, RecUserData, PublicPlaceData } from '../../../types';
import { Form, Dropdown } from 'react-bootstrap'
import Button from 'components/Button';
import CheckBox from 'components/CheckBox';
import Loader from 'components/Loader';
import SearchList from 'components/SearchList';
import ArrowIcon from 'components/Icons/ArrowIcon';
import ArrowDownIcon from 'components/Icons/ArrowDownIcon'
// import ColorPalette from 'components/ColorPalette';
import { useCurrentEvent, useIsEventsChanged, useUsersFromEvent, useGroupsFromEvent, setIsEventsChangedAction, setCurrentEventAction, setUsersFromEventAction, setGroupsFromEventAction} from 'slices/EventsSlice';
import { useUsers, useGroups, setUsersAction, setGroupsAction } from 'slices/GroupsSlice';
import { toast } from 'react-toastify';
import {API_URL} from 'components/urls';
import ColorPalette from "../../components/ColorPalette/ColorPalette";

const colors = [
  {
    key: 'blue',
    value: '#00BFFF'
  },
  {
    key: 'darkBlue',
    value: '#4169e1'
  },
  {
    key: 'red',
    value: '#FF0013'
  },
  {
    key: 'orange',
    value: '#FF4F00'
  },
  {
    key: 'yellow',
    value: '#FFF000'
  },
  {
    key: 'lime',
    value: '#00FF00'
  },
  {
    key: 'green',
    value: '#008000'
  },
  {
    key: 'purple',
    value: '#6F2DA8'
  },
  {
    key: 'pink',
    value: '#E4A0F7'
  },
  {
    key: 'gray',
    value: '#808080'
  },
]

const CalendarPage = () => {
  const dispatch = useDispatch()
  const currentEvent = useCurrentEvent()
  const common = useCommon()
  const users = useUsers()
  const groups = useGroups()
  const usersFromEvent = useUsersFromEvent()
  const groupsFromEvent = useGroupsFromEvent()
  const isEventsChanged = useIsEventsChanged()
  const [events, setEvents] = useState<EventsData[]>()
  const [publicPlaces, setPublicPlaces] = useState<PublicPlaceData[]>()
  const [placeValue, setPlaceValue] = useState<PublicPlaceData | null>()
  const [isPlaceValueChanged, setIsPlaceValueChanged] = useState(false)
  // const [newPlaceValue, setNewPlaceValue] = useState<PublicPlaceData | null>(null)
  const [isModalOpened, setIsModalOpened] = useState(false)
  const [isCreateEventModalOpened, setIsCreateEventModalOpened] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(0)
  const [eventWindowMode, setEventWindowMode] = useState<'showEvent' | 'editEvent' | 'showUsers' | 'editPlace'>('showEvent')
  const [newStartTimeValue, setNewStartTimeValue] = useState('')
  const [newEndTimeValue, setNewEndTimeValue] = useState('')
  const [newTitleValue, setNewTitleValue] = useState('')
  const [newIsNeedScreenValue, setNewIsNeedScreenValue] = useState(false)
  const [newIsNeedComputerValue, setNewIsNeedComputerValue] = useState(false)
  const [isNeedNotification, setIsNeedNotification] = useState(true)
  const [newIsNeedWiteboardValue, setNewIsNeedWhiteboardValue] = useState(false)
  const [newDateValue, setNewDateValue] = useState('')
  const [newColorValue, setNewColorValue] = useState('#4169e1')
  const [isEventsLoading, setIsEventsLoading] = useState(true)
  const [isDetailedEventLoading, setIsDetailedEventLoading] = useState(false)
  // const [isCurrentEventLoading, setIsCurrentEventLoading] = useState(false)
  const [isColorMenuOpened, setIsColorMenuOpened] = useState(false)
  const [isDeleteEventButtonClicked, setIsDeleteEventButtonClicked] = useState(false)
  const [addedUsers, setAddedUsers] = useState<number[]>([])
  const [deletedUsers, setDeletedUsers] = useState<number[]>([])
  const [addedGroups, setAddedGroups] = useState<number[]>([])
  const [deletedGroups, setDeletedGroups] = useState<number[]>([])
  const [currentDate, setCurrentDate] = useState<string>('')
  // const isEventLoading = useIsEventLoading()

  const clearData = () => {
    setNewTitleValue('')
    setNewEndTimeValue('')
    setNewStartTimeValue('')
    setNewIsNeedComputerValue(false)
    setNewIsNeedScreenValue(false)
    setNewIsNeedWhiteboardValue(false)
    setIsNeedNotification(true)
    setPlaceValue(null)
    setNewColorValue('#4169e1')
  }

  const clearSelectedData = () => {
    setAddedGroups([])
    setAddedUsers([])
    setDeletedGroups([])
    setDeletedUsers([])
  }


  const getEvents = async () => {
    try {
      const response = await axios(API_URL + 'events', {
        method: 'GET'
      })
      const newArr = response.data.map((raw: RecEventsData) => {
        return {
          id: raw.id,
          title: raw.title,
          startTime: raw.start_time,
          endTime: raw.end_time,
          notification: raw.notification,
          isNeedScreen: raw.is_need_screen,
          isNeedComputer: raw.is_need_computer,
          isNeedWhiteboard: raw.is_need_whiteboard,
          color: raw.color ? raw.color : '#4169e1'
        }
      })
      setEvents(newArr)
    } catch(e) {
      throw e
    } finally {
      setIsEventsLoading(false)
    }
  }
  const getDetailedEvent = async(id: number) => {
    try {
        const response = await axios(API_URL + `events/${id}/detailed`, {
            method: 'GET'
        })
        dispatch(setCurrentEventAction({
            id: response.data.id,
            title: response.data.title,
            startTime: response.data.start_time,
            endTime: response.data.end_time,
            place: response.data.place,
            notification: response.data.notification,
            isNeedScreen: response.data.is_need_screen,
            isNeedComputer: response.data.is_need_computer,
            isNeedWhiteboard: response.data.is_need_whiteboard,
            // color: response.data.color ? '': '#4169e1'
            color: response.data.color !== '' ? 'red' : 'blue' 
        }))

        // setCurrentDate(response.data.)

        const newUsersArr = response.data.users.map((user: RecUserData) => {
            return {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name
            }
        })
        dispatch(setUsersFromEventAction(newUsersArr))

        dispatch(setGroupsFromEventAction(response.data.groups))

    } catch(e) {
        throw e
    } finally {
      setIsDetailedEventLoading(false)
    }
}

  const putEvent = async (start: string, end: string) => {
    dispatch(setIsEventsChangedAction(true))
    try {
      await axios(API_URL + `events/${currentEvent?.id}`,{
        method: 'PATCH',
        data: {
          title: newTitleValue,
          start_time: start,
          end_time: end,
          notification: isNeedNotification,
          is_need_screen: newIsNeedScreenValue,
          is_need_computer: newIsNeedComputerValue,
          is_need_whiteboard: newIsNeedWiteboardValue,
          color: newColorValue
        },
      })
      toast.success('Информация успешно обновлена!')
    } catch(e) {
      throw e
    } finally {
        setEventWindowMode('showEvent')
        if (currentEvent) {
          setIsDetailedEventLoading(true)
          getDetailedEvent(currentEvent.id)
        }
    }
  }

  const changePlace = async (id: number) => {
    try {
      await axios(API_URL + `events/${id}/change_place`, {
        method: 'PATCH',
        data: {
          id: placeValue?.id,
        }
      })
      if (isModalOpened) {
        toast.success('Информация успешно обновлена!')
      }
    } catch (e) {
      throw e
    } finally {
      if (currentEvent){
      setIsDetailedEventLoading(true)
      getDetailedEvent(currentEvent.id)
    }
    }
  }

  const postEvent = async (start: string, end: string) => {
    setIsEventsLoading(true)
    try {
      const response =await axios(API_URL + 'events', {
        method: 'POST',
        data: {
          title: newTitleValue,
          start_time: start,
          end_time: end,
          notification: isNeedNotification,
          is_need_screen: newIsNeedScreenValue,
          is_need_computer: newIsNeedComputerValue,
          is_need_whiteboard: newIsNeedWiteboardValue,
          color: newColorValue
        }
      })

      if (isPlaceValueChanged) {
        changePlace(response.data.id)
        setIsPlaceValueChanged(false)
      }

      toast.success('Событие добавлено успешно!')
    } catch(e) {
      throw e
    } finally {
      setIsCreateEventModalOpened(false)
      getEvents()
    }
  }

  const deleteEvent = async () => {
    setIsEventsLoading(true)
    try {
        await axios(API_URL + `events/${currentEvent?.id}`, {
        method: 'DELETE',
        })
        toast.success('Событие удалено успешно!')
    } catch(e) {
        throw e
    } finally {
      setIsModalOpened(false)
      setIsDeleteEventButtonClicked(false)
      getEvents()
    }
  }

  const getUsers = async () => {
    try {
      const response = await axios(API_URL + `users`, {
        method: 'GET'
      })

      const newUsersArr = response.data.map((raw: RecUserData) => {
        return {
          id: raw.id,
          firstName: raw.first_name,
          lastName: raw.last_name
        }
      })
      dispatch(setUsersAction(newUsersArr))
    } catch(e) {
      throw e
    }
  }

  const getGroups = async () => {
    try {
      const response = await axios(API_URL + `groups`, {
        method: 'GET'
      })
      dispatch(setGroupsAction(response.data))
    } catch(e) {
      throw e
    }
  }
  
  const getPlaces = async () => {
    try {
      const response = await axios(API_URL + `public_places`, {
        method: 'GET'
      })
      setPublicPlaces(response.data)
      if (!currentEvent?.place) {
        setPlaceValue(response.data[0])
      }
    } catch (e)  {
      throw e
    } finally {
      // setIsCurrentEventLoading(false)
    }
  }

  const addUsersToEvent = async () => {
    try {
      await axios(API_URL + `events/${currentEvent?.id}/add_users`, {
        method: 'PATCH',
        data: addedUsers
      })
    } catch {

    } finally {
      if (currentEvent)
      await getDetailedEvent(currentEvent.id)
    }
  }

  const deleteUsersFromEvent = async () => {
    try {
      await axios(API_URL + `events/${currentEvent?.id}/remove_users`, {
        method: 'PATCH',
        data: deletedUsers
      })
    } catch {

    } finally {
      if (currentEvent)
      await getDetailedEvent(currentEvent.id)
    }
  }

  const addGroupsToEvent = async () => {
    try {
      await axios(API_URL + `events/${currentEvent?.id}/add_groups`, {
        method: 'PATCH',
        data: addedGroups
      })
    } catch {

    } finally {
      if (currentEvent)
      await getDetailedEvent(currentEvent.id)
    }
  }

  const deleteGroupsFromEvent = async () => {
    try {
      await axios(API_URL + `events/${currentEvent?.id}/remove_groups`, {
        method: 'PATCH',
        data: deletedGroups
      })
    } catch {

    } finally {
      if (currentEvent)
      await getDetailedEvent(currentEvent.id)
    }
  }

  React.useEffect(() => {
    // if (common) {
    //   setCurrentDate(common.startDate)
    //   console.log('common', common.startDate)
    // }

    getEvents()
    if (users.length === 0) {
      getUsers()
      getGroups()
    }
    
  }, [isEventsChanged])


  React.useEffect(() => {
    if (currentEvent?.color)  {
      setNewColorValue(currentEvent.color)
    } else {
      setNewColorValue('#4169e1')
    }
  }, [currentEvent])


  const handleEditEventButtonClick = () => {
    // const date = moment(newDateValue, 'YYYY-MM-DD');
    getPlaces()
    setPlaceValue(currentEvent?.place)
    setEventWindowMode('editEvent')
    // setPlaceValue(currentEvent?.place)
    if (currentEvent) {
      setNewTitleValue(currentEvent.title)
      setIsNeedNotification(currentEvent.notification)
      setNewIsNeedComputerValue(currentEvent.isNeedComputer)
      setNewIsNeedScreenValue(currentEvent.isNeedScreen)
      setNewIsNeedWhiteboardValue(currentEvent.isNeedWhiteboard)
      setNewStartTimeValue(moment(currentEvent.startTime).format('HH:mm'))
      setNewEndTimeValue(moment(currentEvent.endTime).format('HH:mm'))
    }
  }

  const handleEditPlaceButtonClick = () => {
    setEventWindowMode('editPlace')
    getPlaces()
    setPlaceValue(currentEvent?.place)
  }

  const handleCreateEventFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const date = moment(newDateValue, 'YYYY-MM-DD');
    console.log(newDateValue)
    const startTime = moment(newStartTimeValue, 'HH:mm');
    date.hour(startTime.hour());
    date.minute(startTime.minute());
    const start = date.format('YYYY-MM-DDTHH:mm:ss');

    const endTIme = moment(newEndTimeValue, 'HH:mm');
    date.hour(endTIme.hour());
    date.minute(endTIme.minute());
    const end = date.format('YYYY-MM-DDTHH:mm:ss');
    
    postEvent(start, end)
  }

  const handleDeleteEventButtonClick = () => {
    setIsDeleteEventButtonClicked(true)
  }

  const handleEditEventFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const date = moment(currentEvent?.endTime);
    if (currentEvent) {
      const startTime = moment(newStartTimeValue, 'HH:mm');
      date.set({
        hour: startTime.hour(),
        minute: startTime.minute(),
        second: startTime.second()
       });
      const start = date.format('YYYY-MM-DDTHH:mm:ss')
      const endTime = moment(newEndTimeValue, 'HH:mm');
      date.set({
        hour: endTime.hour(),
        minute: endTime.minute(),
        second: endTime.second()
       });
       const end = date.format('YYYY-MM-DDTHH:mm:ss')
       putEvent(start, end)
    }
  }

  const handleEditPlaceSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (currentEvent) {
      changePlace(currentEvent?.id)
    }
    setEventWindowMode('showEvent')
  }

  const handleBackClick = () => {
    setEventWindowMode('showEvent')
    setIsModalOpened(false)
    if (isEventsChanged) {
      setIsEventsLoading(true)
      getEvents()
      dispatch(setIsEventsChangedAction(false))
    }
    clearData()
  }

  const handleAddArrowClick = () => {
    if (addedGroups.length !== 0 || addedUsers.length !== 0) {
      clearSelectedData()
      setIsDetailedEventLoading(true)
      if (addedUsers.length !== 0) {
        addUsersToEvent()
      }
      if (addedGroups.length !== 0) {
        addGroupsToEvent()
      }
      if (addedUsers.length !== 0 || addedGroups.length !== 0) {
        toast.success("Информация успешно обновлена!");
      }
    }
  }

  const handleDeleteArrowClick = () => {
    if (deletedGroups.length !== 0 || deletedUsers.length !== 0) {
      clearSelectedData()
      setIsDetailedEventLoading(true)
      if (deletedUsers.length !== 0) {
        deleteUsersFromEvent()
      }
      if (deletedGroups.length !== 0) {
        deleteGroupsFromEvent()
      }
      if (deletedUsers.length !== 0 || deletedGroups.length !== 0) {
        toast.success("Информация успешно обновлена!");
      }
    }
  }

  const handleGroupAdd = (id: number) => {
    if (addedGroups.includes(id)) {
      setAddedGroups(addedGroups.filter(subgroupId => subgroupId !== id));
    } else {
      setAddedGroups([...addedGroups, id]);
    }
  };
  
  const handleUserAdd = (id: number) => {
    if (addedUsers.includes(id)) {
      setAddedUsers(addedUsers.filter(memberId => memberId !== id));
    } else {
      setAddedUsers([...addedUsers, id]);
    }
  };

  const handleGroupDelete = (id: number) => {
    if (deletedGroups.includes(id)) {
      setDeletedGroups(deletedGroups.filter(subgroupId => subgroupId !== id));
    } else {
      setDeletedGroups([...deletedGroups, id]);
    }
  }

  const handleUserDelete = (id: number) => {
    if (deletedUsers.includes(id)) {
      setDeletedUsers(deletedUsers.filter(memberId => memberId !== id));
    } else {
      setDeletedUsers([...deletedUsers, id]);
    }
  }

  const handlePlaceSelect = (eventKey: string | null) => {
    if (eventKey !== null) {
      const selectedPlace = publicPlaces?.find(place => place.id === parseInt(eventKey, 10));
      if (selectedPlace && selectedPlace.id !== placeValue?.id) {
        // setIsDetailedGroupLoading(true)
        setPlaceValue(selectedPlace)
      }
      if (!isPlaceValueChanged) {
        setIsPlaceValueChanged(true)
      }
    }
  };

  const handleColorValueChange = (colorValue: string) => {
    setNewColorValue(colorValue)
    setIsColorMenuOpened(false)
  }

  // React.useEffect(())

  return (
    <div className={styles.events__page}>
     <div className={styles['events__page-wrapper']}>
       <h1 className={styles['events__page-title']}>Календарь мероприятий</h1>
       {isEventsLoading ? <div className={styles.loader__wrapper}>
              <Loader className={styles.loader} size='l' />
          </div>
        : <div className={styles['events__page-content']}>
       {common && events && !isDetailedEventLoading && <FullCalendar
        height={600}
        plugins={[ dayGridPlugin, timeGridPlugin ]}
        initialView="timeGridDay"
        locale={esLocale}
        initialDate={new Date(currentDate)} // Начальная дата
        validRange={{ // Диапазон дат
          start: new Date(common?.startDate), // Минимальная дата
          end: new Date(common?.endDate) // Максимальная дата
        }}
        events={events.map(raw => ({
          id: raw.id.toString(),
          title: `${raw.notification ? '🔔' : '🔕'} ${raw.title}`,
          start: new Date(raw.startTime),
          end: new Date(raw.endTime),
          backgroundColor: raw.color,
        }))}
         titleFormat={{
          month: 'long',
          year: 'numeric',
          day: 'numeric'
         }}
        slotLabelFormat={{ hour: '2-digit', minute: '2-digit' }}
          slotMinTime={'6:00:00'}
          slotMaxTime={'24:00:00'}
          headerToolbar={{
            left: 'title',
            center: '',
            right: 'createEventButton,prev,next'
           }}
           customButtons={{
            createEventButton: {
              text: 'Создать',
              click: function() {
                setIsCreateEventModalOpened(true)
                setNewDateValue(currentDate)
                // setIsCurrentEventLoading(true)
                getPlaces()
                clearData()
              }
            }
           }}
           eventClick={async (info) => {
            setSelectedEvent(Number(info.event.id))
            setIsModalOpened(true)
            setEventWindowMode('showEvent')
            // dispatch(setIsEventLoadingAction(true))
            setIsDetailedEventLoading(true)
            console.log('info us', Number(info.event.id))
            getDetailedEvent(Number(info.event.id))
           }}
           eventContent={(currentEvent) => {
            return { html: currentEvent.event.title };
           }}
           allDaySlot={false}
           datesSet={(dateInfo) => {
            const parts = dateInfo.start.toLocaleDateString('ru-RU').split('.');
            const current = new Date(Date.UTC(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])));
            let formattedDate;
            if (!isNaN(Date.parse(current.toString()))) {
            formattedDate = current.toISOString().substring(0,10);
            console.log('currentDate isss', current);
            // setNewDateValue(formattedDate);
            setCurrentDate(formattedDate)
            } else {
            console.log('Invalid date: ', current);
            }
           }}
           
        />}
       </div>}
     </div>
     {isDetailedEventLoading ? <div className={styles.bloader__wrapper}>
              <Loader className={styles.bloader} size='l' />
          </div>
         :
     <ModalWindow className={styles.modal} handleBackdropClick={handleBackClick} active={isModalOpened}>
         {eventWindowMode === 'showEvent' && isModalOpened ? <DetailedEventInfo handleDeleteEventButtonClick={() => handleDeleteEventButtonClick() } id={selectedEvent} handleEditEventButtonClick={handleEditEventButtonClick} handleShowUsersButtonClick={() => setEventWindowMode('showUsers')} handleEditPlaceButtonClick={handleEditPlaceButtonClick}/>
        : eventWindowMode === 'editEvent' && isModalOpened ? <Form onSubmit={(event: React.FormEvent<HTMLFormElement>) => handleEditEventFormSubmit(event)}
        className={styles['form']}>
          <h3 className={styles.modal__title}>Заполните данные</h3>
          <div className={styles.form__item}>
            <Form.Control onChange={(event: ChangeEvent<HTMLInputElement>) => {setNewTitleValue(event.target.value)}} value={newTitleValue} className={styles.form__input} type="text" placeholder="Название события*" />
          </div>
          <div className={styles.form__item}>
            <Form.Control 
            type="time" 
            value={ newStartTimeValue} 
            onChange={(event) => setNewStartTimeValue(event.target.value)} 
            className={styles.form__input} 
            placeholder="Время начала*" 
            />
          </div>
          <div className={styles.form__item}>
            <Form.Control 
            type="time" 
            value={newEndTimeValue} 
            onChange={(event) => setNewEndTimeValue(event.target.value)} 
            className={styles.form__input} 
            placeholder="Время завершения*" 
            />
          </div>
          <div className={styles.form__item}>
            <p>В какой цвет покрасить?</p>
            <div style={{backgroundColor: newColorValue}} onClick={() => setIsColorMenuOpened(!isColorMenuOpened)}  className={styles.form__color}></div>
          </div>
          {isColorMenuOpened && <ColorPalette className={styles.form__colors} colors={colors} onClick={handleColorValueChange}></ColorPalette>}
          <div className={styles.form__item}>
            <p>Оповещение</p>
            <CheckBox className={styles.form__checkbox} checked={isNeedNotification} onChange={() => setIsNeedNotification(!isNeedNotification)}/>
          </div>
          <div className={`${styles.form__item} ${styles['form__item-choose']}`}>
            <p>Нужен экран?</p> 
            <CheckBox className={styles.form__checkbox} checked={newIsNeedScreenValue} onChange={() => setNewIsNeedScreenValue(!newIsNeedScreenValue)}/>
          </div>
          <div className={styles.form__item}>
            <p>Нужен компьютер?</p> 
            <CheckBox className={styles.form__checkbox} checked={newIsNeedComputerValue} onChange={() => setNewIsNeedComputerValue(!newIsNeedComputerValue)}/>
          </div>
          <div className={styles.form__item}>
            <p>Нужна доска?</p> 
            <CheckBox className={styles.form__checkbox} checked={newIsNeedWiteboardValue} onChange={() => setNewIsNeedWhiteboardValue(!newIsNeedWiteboardValue)}/>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Button className={styles.modal__btn}  disabled={newTitleValue ? false : true} type='submit'>Сохранить</Button>
            <Button className={styles.modal__btn} onClick={() => {setEventWindowMode('showEvent')}}>Назад</Button>
          </div>
        </Form>

        : eventWindowMode === 'showUsers' ? <div className={styles.modal__lists}>
          {isDetailedEventLoading ? <div className={styles.bloader__wrapper}>
              <Loader className={styles.bloader} size='l' />
          </div>
          : eventWindowMode === 'showUsers' && isModalOpened && <>
          <Button className={styles['modal__lists-btn']} onClick={() => {setEventWindowMode('showEvent')}}>Назад</Button>
          <div className={styles.modal__groups}>
            <div>
              <SearchList withActionBlock members={users} subgroups={groups}
              onMemberClick={handleUserAdd} onSubgroupClick={handleGroupAdd} activeMembers={addedUsers} activeSubgroups={addedGroups}><p>Доступные участники и группы</p></SearchList>
              <p> брано: {addedGroups.length + addedUsers.length}</p>
            </div>
              <div className={styles['modal__groups-btns']}>
                  <Button onClick={handleAddArrowClick} className={styles['modal__groups-common']}><ArrowIcon/></Button>
                  <Button onClick={handleDeleteArrowClick} className={styles['modal__groups-reverse']}><ArrowIcon/></Button>
                </div>
            <div>
              <SearchList withActionBlock members={usersFromEvent} subgroups={groupsFromEvent}  onMemberClick={handleUserDelete} onSubgroupClick={handleGroupDelete} activeMembers={deletedUsers} activeSubgroups={deletedGroups}>Текущее событие</SearchList>
              <p>Выбрано: {deletedGroups.length + deletedUsers.length}</p>
            </div>
            </div>
            </>
          }
        </div>
        : isModalOpened && <div>
          <Form onSubmit={(event: React.FormEvent<HTMLFormElement>) => handleEditPlaceSubmit(event)}
            className={styles['form']}>
          <div className={styles.form__item}>
            <Dropdown className={styles['dropdown']} onSelect={handlePlaceSelect}>
                  <Dropdown.Toggle
                      className={styles['dropdown__toggle']}
                      style={{
                          borderColor: '#000',
                          backgroundColor: "#fff",
                          color: '#000',
                      }}
                  >   
                      {placeValue ? <>{placeValue?.name}, {placeValue?.building.name}</>
                      : <>Выберите помещение</>}
                      <ArrowDownIcon className={styles.dropdown__icon}/>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className={styles['dropdown__menu']}>
                      {publicPlaces?.map(place => (
                          <Dropdown.Item className={styles['dropdown__menu-item']} key={place.id} eventKey={place.id}>{place.name}, {place.building.name}</Dropdown.Item>
                      ))}
                  </Dropdown.Menu>
              </Dropdown>
            </div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Button className={styles.modal__btn} type='submit'>Сохранить</Button>
                <Button className={styles.modal__btn} onClick={() => {setEventWindowMode('showEvent')}}>Назад</Button>
              </div>
            </Form>
        </div>
        }
     </ModalWindow>}

      <ModalWindow className={styles.modal} handleBackdropClick={() => setIsCreateEventModalOpened(false)} active={isCreateEventModalOpened}>
      <Form onSubmit={(event: React.FormEvent<HTMLFormElement>) => handleCreateEventFormSubmit(event)}
        className={styles['form']}>
          <h3 className={styles.modal__title}>Заполните данные</h3>
          <div className={styles.form__item}>
            <Form.Control onChange={(event: ChangeEvent<HTMLInputElement>) => {setNewTitleValue(event.target.value)}} value={newTitleValue} className={styles.form__input} type="text" placeholder="Название события*" />
          </div>
          <div className={styles.form__item}>
            <Dropdown className={styles['dropdown']} onSelect={handlePlaceSelect}>
                  <Dropdown.Toggle
                      className={styles['dropdown__toggle']}
                      style={{
                          borderColor: '#000',
                          backgroundColor: "#fff",
                          color: '#000',
                      }}
                  >   
                      {placeValue ? <>{placeValue?.name}, {placeValue?.building.name}</>
                      : <>Выберите помещение</>}
                      <ArrowDownIcon className={styles.dropdown__icon}/>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className={styles['dropdown__menu']}>
                      {publicPlaces?.map(place => (
                          <Dropdown.Item className={styles['dropdown__menu-item']} key={place.id} eventKey={place.id}>{place.name}, {place.building.name}</Dropdown.Item>
                      ))}
                  </Dropdown.Menu>
              </Dropdown>
          </div>
          <div className={styles.form__item}>
          {common && <Form.Control 
          type="date" 
          value={newDateValue} 
          onChange={(event) => setNewDateValue(event.target.value)} 
          className={styles.form__input} 
          placeholder="Дата*" 
          min={common.startDate} // Минимальная дата
          max={common.endDate} // Максимальная дата
          />}
          </div>
          <div className={styles.form__item}>
            <Form.Control 
              type="time"
              value={ newStartTimeValue} 
              onChange={(event) => setNewStartTimeValue(event.target.value)} 
              className={styles.form__input} 
              placeholder="Время начала*" 
            />
          </div>

          <Form.Control 
            type="time" 
            value={ newEndTimeValue} 
            onChange={(event) => setNewEndTimeValue(event.target.value)} 
            className={styles.form__input} 
            placeholder="Время окончания*" 
          />


          <div className={styles.form__item}>
            <p>В какой цвет покрасить?</p>
            <div style={{backgroundColor: newColorValue}} onClick={() => setIsColorMenuOpened(!isColorMenuOpened)}  className={styles.form__color}></div>
          </div>
          {isColorMenuOpened && <ColorPalette className={styles.form__colors} colors={colors} onClick={handleColorValueChange}></ColorPalette>}
          <div className={styles.form__item}>
            <p>Оповещение</p>
            <CheckBox className={styles.form__checkbox} checked={isNeedNotification} onChange={() => setIsNeedNotification(!isNeedNotification)}/>
          </div>
          <div className={`${styles.form__item} ${styles['form__item-choose']}`}>
            <p>Нужен экран?</p> 
            <CheckBox className={styles.form__checkbox} checked={newIsNeedScreenValue} onChange={() => setNewIsNeedScreenValue(!newIsNeedScreenValue)}/>
          </div>
          <div className={styles.form__item}>
            <p>Нужен компьютер?</p> 
            <CheckBox className={styles.form__checkbox} checked={newIsNeedComputerValue} onChange={() => setNewIsNeedComputerValue(!newIsNeedComputerValue)}/>
          </div>
          <div className={styles.form__item}>
            <p>Нужна доска?</p> 
            <CheckBox className={styles.form__checkbox} checked={newIsNeedWiteboardValue} onChange={() => setNewIsNeedWhiteboardValue(!newIsNeedWiteboardValue)}/>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Button style={{width: '100%'}}  disabled={newTitleValue && placeValue &&  newStartTimeValue && newEndTimeValue && newDateValue ? false : true} type='submit'>Сохранить</Button>
          </div>
        </Form>
        {/* <SearchList onMemberClick={(id) => {setSelectedUser(id); setUsersWindowMode('detailed')}} allUsers/> */}
      </ModalWindow>

      <ModalWindow handleBackdropClick={() => setIsDeleteEventButtonClicked(false)} active={isDeleteEventButtonClicked} className={styles.modal}>
        <h3 className={styles.modal__title}>Вы уверены, что хотите удалить данное событие?</h3>
        <div className={styles['modal__delete-btns']}>
          <Button onClick={() => deleteEvent()} className={styles.modal__btn}>Подтвердить</Button>
          <Button onClick={() => setIsDeleteEventButtonClicked(false)} className={styles.modal__btn}>Закрыть</Button>
        </div>
      </ModalWindow>
   </div>
  )
}

export default CalendarPage

