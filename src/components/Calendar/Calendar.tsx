import React from 'react'
import styles from './Calendar.module.scss'
import { DayData, EventData } from '../../../types'
import Button from 'react-bootstrap/Button';
  
type CalendarProps = {
    days: DayData[];
    className?: string;
};

const Calendar: React.FC<CalendarProps> = ({days}) => {
  return (
    <div className={styles.calendar}>
        {days.map((day: DayData) => (
            <div key={day.id} className={styles.calendar__item}>
                <div className={styles['calendar__item-info']}>
                    <div className={styles['calendar__item-subtitles']}>
                        <p className={styles['calendar__item-subtitle']}>{day.title}</p>
                        <p className={styles['calendar__item-subtitle']}>{day.weekDay}</p>
                    </div>
                    <div className={styles['calendar__item-events']}>
                        {day.events.map((event: EventData) => (
                            <p className={styles['calendar__item-event']}>
                                {event.title}  с {event.timeStart} до {event.timeEnd} 
                                <br/>
                                Место проведения: {event.place}
                            </p>
                        ))}
                        <Button className={styles['test']}>Посмотреть все</Button>  
                    </div>
                </div>
                
            </div>
        ))}
    </div>
  )
}

export default Calendar