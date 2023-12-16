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
import { RecEventsData, EventsData } from '../../../types';
import { Form } from 'react-bootstrap'
import Button from 'components/Button';
import CheckBox from 'components/CheckBox';
import Loader from 'components/Loader';
import { useCurrentEvent, useIsEventsChanged, setIsEventsChangedAction } from 'slices/EventsSlice';
import { toast } from 'react-toastify';
 
const CalendarPage = () => {
  const dispatch = useDispatch()
  const currentEvent = useCurrentEvent()
  const common = useCommon()
  const isEventsChanged = useIsEventsChanged()
  const [events, setEvents] = useState<EventsData[]>()
  // const [isCreateModalOpened, setIsCreateModalOpened] = useState(false)
  const [isModalOpened, setIsModalOpened] = useState(false)
  const [isCreateEventModalOpened, setIsCreateEventModalOpened] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(0)
  const [eventWindowMode, setEventWindowMode] = useState<'showEvent' | 'editEvent' | 'showUsers'>('showEvent')
  // const [isShowEvent, setIsShowEvent] = useState(false)
  // const [isEditEvent, setIsEditEvent] = useState(false)
  const [newStartTimeValue, setNewStartTimeValue] = useState('')
  const [newEndTimeValue, setNewEndTimeValue] = useState('')
  const [newTitleValue, setNewTitleValue] = useState('')
  const [newIsNeedScreenValue, setNewIsNeedScreenValue] = useState(false)
  const [newIsNeedComputerValue, setNewIsNeedComputerValue] = useState(false)
  const [newIsNeedWiteboardValue, setNewIsNeedWhiteboardValue] = useState(false)
  const [newDateValue, setNewDateValue] = useState('')
  const [isEventsLoading, setIsEventsLoading] = useState(true)

  const clearData = () => {
    setNewTitleValue('')
    setNewEndTimeValue('')
    setNewStartTimeValue('')
    setNewIsNeedComputerValue(false)
    setNewIsNeedScreenValue(false)
    setNewIsNeedWhiteboardValue(false)
  }


  const getEvents = async () => {
    try {
      const response = await axios('https://specializedcampbeta.roxmiv.com/api/events', {
        method: 'GET',
        withCredentials: true
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
          isNeedWhiteboard: raw.is_need_whiteboard
        }
      })
      setEvents(newArr)
    } catch(e) {
      throw e
    } finally {
      setIsEventsLoading(false)
    }
  }

  const putEvent = async (start: string, end: string) => {
    dispatch(setIsEventsChangedAction(true))
    try {
      await axios(`https://specializedcampbeta.roxmiv.com/api/events/${currentEvent?.id}`,{
        method: 'PATCH',
        data: {
          title: newTitleValue,
          start_time: start,
          end_time: end,
          is_need_screen: newIsNeedScreenValue,
          is_need_computer: newIsNeedComputerValue,
          is_need_whiteboard: newIsNeedWiteboardValue
        },
        // withCredentials: true
      })
      toast.success('Информация успешно обновлена!')
    } catch(e) {
      throw e
    } finally {
        setEventWindowMode('showEvent')
    }
  }

  const postEvent = async (start: string, end: string) => {
    setIsEventsLoading(true)
    try {
      await axios('https://specializedcampbeta.roxmiv.com/api/events', {
        method: 'POST',
        data: {
          title: newTitleValue,
          start_time: start,
          end_time: end,
          is_need_screen: newIsNeedScreenValue,
          is_need_computer: newIsNeedComputerValue,
          is_need_whiteboard: newIsNeedWiteboardValue
        },
        // withCredentials: true 
      })

      toast.success('Событие добавлено успешно!')
    } catch(e) {
      throw e
    } finally {
      setIsCreateEventModalOpened(false)
      getEvents()
    }
  }

  const deleteEvent = async () => {
    try {
        await axios(`https://specializedcampbeta.roxmiv.com/api/events/${currentEvent?.id}`, {
        method: 'DELETE',
        })
        toast.success('Событие удалено успешно!')
    } catch(e) {
        throw e
    } finally {
      setIsModalOpened(false)
    }
    }

  React.useEffect(() => {
    getEvents()
  }, [])

  const handleEditEventButtonClick = () => {
    setEventWindowMode('editEvent')
    if (currentEvent) {
      setNewTitleValue(currentEvent.title)
      setNewIsNeedComputerValue(currentEvent.isNeedComputer)
      setNewIsNeedScreenValue(currentEvent.isNeedScreen)
      setNewIsNeedWhiteboardValue(currentEvent.isNeedWhiteboard)
      setNewStartTimeValue(moment(currentEvent.startTime).format('HH:mm'))
      setNewEndTimeValue(moment(currentEvent.endTime).format('HH:mm'))
    }
  }

  const handleCreateEventFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const date = moment(newDateValue, 'YYYY-MM-DD');
    const startTime = moment(newStartTimeValue, 'HH:mm');
    date.hour(startTime.hour());
    date.minute(startTime.minute());
    const start = date.format('YYYY-MM-DDTHH:mm:ss.SSSZ');

    const endTIme = moment(newEndTimeValue, 'HH:mm');
    date.hour(endTIme.hour());
    date.minute(endTIme.minute());
    const end = date.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    
    postEvent(start, end)
  }

  const handleEditEventFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const date = moment(currentEvent?.endTime);
    console.log('было', date)
    if (currentEvent) {
      const startTime = moment(newStartTimeValue, 'HH:mm');
      date.set({
        hour: startTime.hour(),
        minute: startTime.minute(),
        second: startTime.second()
       });
      const start = date.toISOString()
      const endTime = moment(newEndTimeValue, 'HH:mm');
      date.set({
        hour: endTime.hour(),
        minute: endTime.minute(),
        second: endTime.second()
       });
       const end = date.toISOString()
       putEvent(start, end)
    }
  }

  const handleBackClick = () => {
    if (isEventsChanged) {
      setIsEventsLoading(true)
      getEvents()
      dispatch(setIsEventsChangedAction(false))
    }
    setIsModalOpened(false)
    clearData()
  }

  return (
    <div className={styles.events__page}>
     <div className={styles['events__page-wrapper']}>
       <h1 className={styles['events__page-title']}>Календарь мероприятий</h1>
       {isEventsLoading ? <div className={styles.loader__wrapper}>
              <Loader className={styles.loader} size='l' />
          </div>
        : <div className={styles['events__page-content']}>
       {common && events && <FullCalendar
        height={600}
        plugins={[ dayGridPlugin, timeGridPlugin ]}
        initialView="timeGridWeek"
        locale={esLocale}
        initialDate={new Date(common?.startDate)} // Начальная дата
        validRange={{ // Диапазон дат
          start: new Date(common?.startDate), // Минимальная дата
          end: new Date(common?.endDate) // Максимальная дата
        }}
        events={events.map(raw => ({
          id: raw.id.toString(), // Преобразуйте id в строку
          title: raw.title,
          start: new Date(raw.startTime), // Преобразуйте start_time в объект Date
          end: new Date(raw.endTime), // Преобразуйте end_time в объект Date
         }))}
        slotLabelFormat={{ hour: '2-digit', minute: '2-digit' }}
          slotMinTime={'7:00:00'}
          slotMaxTime={'26:00:00'}
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
              }
            }
           }}
           eventClick={(info) => {
            console.log('Clicked on event with id: ' + info.event.id);
            setIsModalOpened(true)
            setEventWindowMode('showEvent')
            setSelectedEvent(Number(info.event.id))
           }}
        />}
       </div>}
     </div>
     <ModalWindow className={styles.modal} handleBackdropClick={handleBackClick} active={isModalOpened}>
        {eventWindowMode === 'showEvent' && isModalOpened ? <DetailedEventInfo handleDeleteEventButtonClick={() => deleteEvent()} id={selectedEvent} handleEditEventButtonClick={handleEditEventButtonClick}/>
        : isModalOpened &&<Form onSubmit={(event: React.FormEvent<HTMLFormElement>) => handleEditEventFormSubmit(event)}
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
        }
     </ModalWindow>

      <ModalWindow className={styles.modal} handleBackdropClick={() => setIsCreateEventModalOpened(false)} active={isCreateEventModalOpened}>
      <Form onSubmit={(event: React.FormEvent<HTMLFormElement>) => handleCreateEventFormSubmit(event)}
        className={styles['form']}>
          <h3 className={styles.modal__title}>Заполните данные</h3>
          <div className={styles.form__item}>
            <Form.Control onChange={(event: ChangeEvent<HTMLInputElement>) => {setNewTitleValue(event.target.value)}} value={newTitleValue} className={styles.form__input} type="text" placeholder="Название события*" />
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
            <Button style={{width: '100%'}}  disabled={newTitleValue ? false : true} type='submit'>Сохранить</Button>
          </div>
        </Form>
      </ModalWindow>
   </div>
  )
}

export default CalendarPage