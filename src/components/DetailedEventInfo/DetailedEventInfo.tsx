import React, { useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './DetailedEventInfo.module.scss'
import { EventsData } from '../../../types';

export type DetailedInfoProps = {
    id: number;
    onBackButtonClick?: () => void;
    onDeleteUserClick?: () => void;
};

const DetailedEventInfo: React.FC<DetailedInfoProps> = ({id}) => {
    const [currentEvent, setCurrentEvent] = useState<EventsData>()
    const [NecessaryRquipment, setNecessaryRquipment] = useState('')
    // const putEvent = async (event: EventsData) => {
    //     try {
    //       const response = await axios(`https://specializedcampbeta.roxmiv.com/api/events/${event.id}`, {
    //         method: 'PUT',
    //         data: {
    //           title: event.title,
    //           start_time: event.startTime,
    //           end_time: event.endTime,
    //           notification: event.notification,
    //           is_need_screen: event.isNeedScreen,
    //           is_need_computer: event.isNeedComputer,
    //           is_need_whiteboard: event.isNeedWhiteboard
    //         }
    //       })
    
    //       dispatch(setEventsAction([events, response.data]))
    //     } catch(e) {
    //       throw e
    //     }
    //   }
    
    //   const deleteEvent = async (id: number) => {
    //     try {
    //       const response = await axios(`https://specializedcampbeta.roxmiv.com/api/events/${id}`, {
    //         method: 'DELETE',
    //       })
    
    //       // Нужно еще изменить глобальное состояние событий
    //     } catch(e) {
    //       throw e
    //     }
    //   }

    const getDetailedEvent = async() => {
        try {
            const response = await axios(`https://specializedcampbeta.roxmiv.com/api/events/${id}/detailed`, {
                method: 'GET'
            })
            console.log(response.data)
            setCurrentEvent({
                id: response.data.id,
                title: response.data.title,
                startTime: response.data.start_time,
                endTime: response.data.end_time,
                place: response.data.place,
                notification: response.data.notification,
                isNeedScreen: response.data.isNeedSreen,
                isNeedComputer: response.data.isNeedComputer,
                isNeedWhiteboard: response.data.isNeedWhiteboard
            })
            getNecessaryRquipment(response.data.is_need_computer, response.data.is_need_screen, response.data.is_need_whiteboard)
        } catch(e) {
            throw e
        }
    }
    
    const getNecessaryRquipment = (isNeedScreen: boolean, isNeedComputer: boolean, isNeedWhiteboard: boolean) => {
        let res = ''
        if (isNeedComputer) {
            res += 'компьютер'
        }
        if (isNeedScreen) {
            res += 'экран'
        }
        if (isNeedWhiteboard) {
            res += 'доска'
        }
        setNecessaryRquipment(res)
    }

    React.useEffect(() => {
        getDetailedEvent();
      }, [])

    return (
        <div className={styles.detailed}>
            <h4 className={styles.detailed__title}>{currentEvent?.title}</h4>
            {currentEvent && <h5 className={styles.detailed__subtitle}> {new Date(currentEvent.endTime).toString()}</h5>}
        </div>
    )
}

export default DetailedEventInfo