// import React from 'react'
// import axios from 'axios'
// const getEvents = async () => {
  //   try {
  //     const response = await axios('https://specializedcampbeta.roxmiv.com/api/events', {
  //       method: 'GET'
  //     })
  //     const newArr = response.data.map((raw: RecEventsData) => {
  //       return {
  //         id: raw.id,
  //         title: raw.title,
  //         startTime: raw.start_time,
  //         endTime: raw.end_time,
  //         notification: raw.notification,
  //         isNeedScreen: raw.is_need_screen,
  //         isNeedComputer: raw.is_need_computer,
  //         isNeedWhiteboard: raw.is_need_whiteboard
  //       }
  //     })
  //     console.log(1111)
  //     dispatch(setEventsAction(newArr))
  //   } catch(e) {
  //     throw e
  //   }
  // }

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

  // const putEvent = async (event: EventsData) => {
  //   try {
  //     const response = await axios(`https://specializedcampbeta.roxmiv.com/api/events/${event.id}`, {
  //       method: 'PUT',
  //       data: {
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

  // const deleteEvent = async (id: number) => {
  //   try {
  //     const response = await axios(`https://specializedcampbeta.roxmiv.com/api/events/${id}`, {
  //       method: 'DELETE',
  //     })

  //     // Нужно еще изменить глобальное состояние событий
  //   } catch(e) {
  //     throw e
  //   }
  // }

  // React.useEffect(() => {
  //   getEvents();
  // }, [])

// import Calendar from 'components/Calendar'
// import { DayData, EventData } from '../../../types'
// import { RecEventsData } from '../../../types'
// import { useDispatch } from 'react-redux'
// import { useEvents, setEventsAction } from 'slices/EventsSlice'



import React from 'react';

import styles from './CalendarPage.module.scss'
import 'react-big-calendar/lib/css/react-big-calendar.css';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid';

import esLocale from '@fullcalendar/core/locales/ru';
import { useEffect } from 'react';
import moment, { months } from 'moment';
import 'moment/dist/locale/ru';

// const localizer = momentLocalizer(moment);


const events = [
  {
    title: 'Событие 1',
    start: new Date(2023, 11, 14, 18, 0), // Пример даты и времени начала события
    end: new Date(2023, 11, 14, 20, 0), // Пример даты и времени окончания события
  },
  {
    title: 'Событие 2',
    start: new Date(2023, 11, 14, 19, 0), // Пример даты и времени начала события
    end: new Date(2023, 11, 14, 19, 30), // Пример даты и времени окончания события
  },
  {
    title: 'Событие 3',
    start: new Date(2023, 11, 14, 12, 0), // Пример даты и времени начала события
    end: new Date(2023, 11, 14, 15, 30), // Пример даты и времени окончания события
  },
];
type Event = {
  title: string;
  start: Date;
  end: Date;
  [key: string]: any;
 };

 import styled from "@emotion/styled";


//  export const StyleWrapper = styled.div`
//  .fc-button.fc-prev-button, .fc-button.fc-next-button, .fc-button.fc-button-primary{
//    background: red;
//    background-image: none;
// }`

const CalendarPage = () => {


  return (
    <div className={styles.events__page}>
     <div className={styles['events__page-wrapper']}>
       <h1 className={styles['events__page-title']}>Календарь мероприятий</h1>
       <div className={styles['events__page-content']}>
       {/* <StyleWrapper> */}
       <FullCalendar
        plugins={[ dayGridPlugin, timeGridPlugin ]}
        initialView="timeGridWeek"
        locale={esLocale}
        initialDate={new Date(2023, 11, 12)} // Начальная дата
        validRange={{ // Диапазон дат
          start: new Date(2023, 11, 12), // Минимальная дата
          end: new Date(2023, 11, 20) // Максимальная дата
        }}
        events={events}
        slotLabelFormat={{ hour: '2-digit', minute: '2-digit' }}
      />
      {/* </StyleWrapper> */}
       </div>
     </div>
   </div>
  )
}

export default CalendarPage