// import React from 'react'
// import axios from 'axios'


  // const postEvent = async (event: EventsData) => {
  //   try {
  //     const response = await axios('https://specializedcampbeta.roxmiv.com/api/events', {
  //       method: 'POST',
  //       data: {
  //         id: event.id,
  //         title: event.title,
  //         start_time: event.startTime,
  //         end_time: event.endTime,
  //         notification: event.notification,
  //         is_need_screen: event.isNeedScreen,
  //         is_need_computer: event.isNeedComputer,
  //         is_need_whiteboard: event.isNeedWhiteboard
  //       }
  //     })

  //     dispatch(setEventsAction([events, response.data]))
  //   } catch(e) {
  //     throw e
  //   }
  // }

// import Calendar from 'components/Calendar'
// import { DayData, EventData } from '../../../types'
// import { RecEventsData } from '../../../types'
// import { useDispatch } from 'react-redux'
// import { useEvents, setEventsAction } from 'slices/EventsSlice'



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
import { useCommon } from 'slices/MainSlice';
import axios from 'axios'
import { RecEventsData, EventsData } from '../../../types';
import { Form } from 'react-bootstrap'
import Button from 'components/Button';
import CheckBox from 'components/CheckBox';
import { useCurrentEvent } from 'slices/EventsSlice';
 
const CalendarPage = () => {
  const currentEvent = useCurrentEvent()
  const common = useCommon()
  const [events, setEvents] = useState<EventsData[]>()
  // const [isCreateModalOpened, setIsCreateModalOpened] = useState(false)
  const [isModalOpened, setIsModalOpened] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(0)
  const [isShowEvent, setIsShowEvent] = useState(false)
  const [isEditEvent, setIsEditEvent] = useState(false)
  const [newStartTimeValue, setNewStartTimeValue] = useState('')
  const [newEndTimeValue, setNewEndTimeValue] = useState('')
  const [newTitleValue, setNewTitleValue] = useState('')
  const [newIsNeedScreenValue, setNewIsNeedScreenValue] = useState(false)
  const [newIsNeedComputerValue, setNewIsNeedComputerValue] = useState(false)
  const [newIsNeedWiteboardValue, setNewIsNeedWhiteboardValue] = useState(false)


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
    }
  }

  const putEvent = async (start: string, end: string) => {
    try {
      await axios(`https://specializedcampbeta.roxmiv.com/api/events/${currentEvent?.id}`,{
        method: 'PATCH',
        data: {
          title: newTitleValue,
          start_time: start,
          end_time: end,
          is_need_sreen: newIsNeedScreenValue,
          is_need_computer: newIsNeedComputerValue,
          is_need_whiteboard: newIsNeedWiteboardValue
        },
        // withCredentials: true
      })
    } catch {

    }
  }

  React.useEffect(() => {
    getEvents()
  }, [])

  const handleEditEventButtonClick = () => {
    setIsEditEvent(true)
    setIsShowEvent(false)
    if (currentEvent) {
      setNewTitleValue(currentEvent.title)
      setNewIsNeedComputerValue(currentEvent.isNeedComputer)
      setNewIsNeedScreenValue(currentEvent.isNeedScreen)
      setNewIsNeedWhiteboardValue(currentEvent.isNeedWhiteboard)
      setNewStartTimeValue(moment(currentEvent.startTime).format('HH:mm'))
      setNewEndTimeValue(moment(currentEvent.endTime).format('HH:mm'))
    }
  }

  React.useEffect(() => {
    console.log('isneeed')
    console.log(currentEvent?.isNeedComputer)
  }, [isEditEvent])

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

  return (
    <div className={styles.events__page}>
     <div className={styles['events__page-wrapper']}>
       <h1 className={styles['events__page-title']}>Календарь мероприятий</h1>
       <div className={styles['events__page-content']}>
       {common && events && <FullCalendar
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
            right: 'prev,next'
           }}
           eventClick={(info) => {
            console.log('Clicked on event with id: ' + info.event.id);
            setIsModalOpened(true)
            setIsShowEvent(true)
            setSelectedEvent(Number(info.event.id))
           }}
        />}
       </div>
     </div>
     <ModalWindow className={styles.modal} handleBackdropClick={() => setIsModalOpened(false)} active={isModalOpened}>
        {isShowEvent && isModalOpened ? <DetailedEventInfo id={selectedEvent} handleEditEventButtonClick={handleEditEventButtonClick}/>
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
          <Button disabled={newTitleValue ? false : true} type='submit'>Сохранить</Button>
        </Form>
        }
     </ModalWindow>
   </div>
  )
}

export default CalendarPage