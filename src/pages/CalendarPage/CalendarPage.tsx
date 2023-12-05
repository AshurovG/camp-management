import React from 'react'
import styles from './CalendarPage.module.scss'
import Calendar from 'components/Calendar'
import { DayData, EventData } from '../../../types'

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