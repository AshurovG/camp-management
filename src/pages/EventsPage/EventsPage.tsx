import React from 'react'
import styles from './EventsPage.module.scss'
import CustomTable from 'components/CustomTable'
import Button from 'components/Button'

const events = [
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

const columns = [
  {
    key: 'title',
    title: 'Название'
  },
  {
    key: 'timeStart',
    title: 'Время начала'
  },
  {
    key: 'timeEnd',
    title: 'Время окончания'
  },
  {
    key: 'place',
    title: 'Место проведения'
  }
]

const EventsPage = () => {
  return (
    <div className={styles.events__page}>
      <div className={styles['events__page-wrapper']}>
        <h1 className={styles['events__page-title']}>Мероприятия на данный день</h1>
        <div className={styles['events__page-content']}>
          <CustomTable events={events} columns={columns}><Button >fsds</Button></CustomTable>
        </div>
      </div>
    </div>
  )
}

export default EventsPage