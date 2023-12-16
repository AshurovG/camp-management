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



import React, { useState } from 'react';

import styles from './CalendarPage.module.scss'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import DetailedEventInfo from 'components/DetailedEventInfo';
import ModalWindow from 'components/ModalWindow';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' 
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/ru';
import { useEffect } from 'react';
// import moment, { months } from 'moment';
// import 'moment/dist/locale/ru';
import { useCommon } from 'slices/MainSlice';
import axios from 'axios'
import { RecEventsData, EventsData } from '../../../types';

const CalendarPage = () => {
  const common = useCommon()
  const [events, setEvents] = useState<EventsData[]>()
  const [isCreateModalOpened, setIsCreateModalOpened] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(0)
  // const [currentEvent]

  const getEvents = async () => {
    try {
      const response = await axios('https://specializedcampbeta.roxmiv.com/api/events', {
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
          isNeedWhiteboard: raw.is_need_whiteboard
        }
      })
      setEvents(newArr)
    } catch(e) {
      throw e
    }
  }

  React.useEffect(() => {
    getEvents()
  }, [])

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
            setIsCreateModalOpened(true)
            setSelectedEvent(Number(info.event.id))
           }}
        />}
       </div>
     </div>
     <ModalWindow handleBackdropClick={() => setIsCreateModalOpened(false)} active={isCreateModalOpened}>
        {selectedEvent !== 0 && <DetailedEventInfo id={selectedEvent}/>}
     </ModalWindow>
   </div>
  )
}

export default CalendarPage