import React from 'react'
import axios from 'axios'
import styles from './CalendarPage.module.scss'
import Calendar from 'components/Calendar'
import { DayData, EventData } from '../../../types'
import { EventsData, RecEventsData } from '../../../types'
import { useDispatch } from 'react-redux'
import { useEvents, setEventsAction } from 'slices/EventsSlice'

const days = [
  {
    id: 1,
    title: '1 декабря',
    weekDay: 'Понедельник',
    events: [
      {
        id: 1,
        title: 'Событие 1',
        timeStart: '10:00',
        timeEnd: '12:00',
        place: 'Актовый зал'
      },
      {
        id: 2,
        title: 'Событие 2',
        timeStart: '10:00',
        timeEnd: '12:00',
        place: 'Актовый зал'
      },
      {
        id: 3,
        title: 'Событие 3',
        timeStart: '10:00',
        timeEnd: '12:00',
        place: 'Актовый зал'
      }
    ]
  },
  {
    id: 2,
    title: '2 декабря',
    weekDay: 'Вторник',
    events: [
      {
        id: 1,
        title: 'Событие 1',
        timeStart: '10:00',
        timeEnd: '12:00',
        place: 'Актовый зал'
      },
      {
        id: 2,
        title: 'Событие 2',
        timeStart: '10:00',
        timeEnd: '12:00',
        place: 'Актовый зал'
      },
      {
        id: 3,
        title: 'Событие 3',
        timeStart: '10:00',
        timeEnd: '12:00',
        place: 'Актовый зал'
      }
    ]
  },
  {
    id: 3,
    title: '3 декабря',
    weekDay: 'Среда',
    events: [
      {
        id: 1,
        title: 'Событие 1',
        timeStart: '10:00',
        timeEnd: '12:00',
        place: 'Актовый зал'
      },
      {
        id: 2,
        title: 'Событие 2',
        timeStart: '10:00',
        timeEnd: '12:00',
        place: 'Актовый зал'
      },
      {
        id: 3,
        title: 'Событие 3',
        timeStart: '10:00',
        timeEnd: '12:00',
        place: 'Актовый зал'
      }
    ]
  },
  {
    id: 4,
    title: '4 декабря',
    weekDay: 'Четверг',
    events: [
      {
        id: 1,
        title: 'Событие 1',
        timeStart: '10:00',
        timeEnd: '12:00',
        place: 'Актовый зал'
      },
      {
        id: 2,
        title: 'Событие 2',
        timeStart: '10:00',
        timeEnd: '12:00',
        place: 'Актовый зал'
      },
      {
        id: 3,
        title: 'Событие 3',
        timeStart: '10:00',
        timeEnd: '12:00',
        place: 'Актовый зал'
      }
    ]
  },
  {
    id: 5,
    title: '5 декабря',
    weekDay: 'Пятница',
    events: [
      {
        id: 1,
        title: 'Событие 1',
        timeStart: '10:00',
        timeEnd: '12:00',
        place: 'Актовый зал'
      },
      {
        id: 2,
        title: 'Событие 2',
        timeStart: '10:00',
        timeEnd: '12:00',
        place: 'Актовый зал'
      },
      {
        id: 3,
        title: 'Событие 3',
        timeStart: '10:00',
        timeEnd: '12:00',
        place: 'Актовый зал'
      }
    ]
  },
  {
    id: 6,
    title: '6 декабря',
    weekDay: 'Суббота',
    events: [
      {
        id: 1,
        title: 'Событие 1',
        timeStart: '10:00',
        timeEnd: '12:00',
        place: 'Актовый зал'
      },
      {
        id: 2,
        title: 'Событие 2',
        timeStart: '10:00',
        timeEnd: '12:00',
        place: 'Актовый зал'
      },
      {
        id: 3,
        title: 'Событие 3',
        timeStart: '10:00',
        timeEnd: '12:00',
        place: 'Актовый зал'
      }
    ]
  }
]

const CalendarPage = () => {
  const dispatch = useDispatch();
  const events = useEvents();

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
      console.log(1111)
      dispatch(setEventsAction(newArr))
    } catch(e) {
      throw e
    }
  }

  React.useEffect(() => {
    getEvents();
  }, [])

  return (
    <div className={styles.events__page}>
        <div className={styles['events__page-wrapper']}>
            <h1 className={styles['events__page-title']}>Календарь мероприятий</h1>
            <div className={styles['events__page-content']}>
              <Calendar days={days}/>
            </div>
        </div>
    </div>
  )
}

export default CalendarPage