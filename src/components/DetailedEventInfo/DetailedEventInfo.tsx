import React, { useState } from 'react'
import axios from 'axios';
import moment from 'moment';
import 'moment/dist/locale/ru';
import { toast } from 'react-toastify';
import styles from './DetailedEventInfo.module.scss'
import { EventsData } from '../../../types';
import EditIcon from 'components/Icons/EditIcon';
import BasketIcon from 'components/Icons/BasketIcon';
import Button from 'components/Button';
import { useDispatch } from 'react-redux';
import { useCurrentEvent, setCurrentEventAction } from 'slices/EventsSlice';

export type DetailedInfoProps = {
    id: number;
    handleEditEventButtonClick?: () => void;
    handleDeleteEventButtonClick?: () => void;
    handleShowUsersButtonClick?: () => void;
    handleEditPlaceButtonClick?: () => void;
};

const DetailedEventInfo: React.FC<DetailedInfoProps> = ({id, handleEditEventButtonClick}) => {
    const dispatch = useDispatch()
    const currentEvent = useCurrentEvent()
    // const [currentEvent, setCurrentEvent] = useState<EventsData>()
    const [necessaryEquipment, setNecessaryEquipment] = useState('')
    
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
                method: 'GET',
                withCredentials: true
            })
            console.log(response.data)
            dispatch(setCurrentEventAction({
                id: response.data.id,
                title: response.data.title,
                startTime: response.data.start_time,
                endTime: response.data.end_time,
                place: response.data.place,
                notification: response.data.notification,
                isNeedScreen: response.data.is_need_screen,
                isNeedComputer: response.data.is_need_computer,
                isNeedWhiteboard: response.data.is_need_whiteboard
            }))
            getNecessaryRquipment(response.data.is_need_screen, response.data.is_need_computer, response.data.is_need_whiteboard)
        } catch(e) {
            throw e
        }
    }
    
    const getNecessaryRquipment = (isNeedScreen: boolean, isNeedComputer: boolean, isNeedWhiteboard: boolean) => {
        const items = [];
        if (isNeedComputer) {
            items.push('компьютер');
          }
          if (isNeedScreen) {
            items.push('экран');
          }
          if (isNeedWhiteboard) {
            items.push('доска');
          }
          const res = items.join(', ');
          setNecessaryEquipment(res);
    }

    React.useEffect(() => {
        getDetailedEvent();
        console.log('visible')
      }, [])

    return (
        <div className={styles.detailed}>
            <h4 className={styles.detailed__title}>{currentEvent?.title}</h4>
            {currentEvent && <h5 className={styles.detailed__subtitle}> {moment(currentEvent.startTime).format('D MMMM')}, {moment(currentEvent.startTime).format('HH:mm')} - {moment(currentEvent.endTime).format('HH:mm')}</h5>}
            <div className={styles.detailed__btns}>
                <EditIcon onClick={handleEditEventButtonClick}/>
                <BasketIcon/>
                <Button>Участники</Button>
            </div>
            <ul className={styles.detailed__list}>
               <li>Необходимое оборудование: {necessaryEquipment}</li>
               { currentEvent?.place ? <li className={styles['detailed__list-item-action']}><span>Место проведения: {currentEvent?.place.name} {currentEvent?.place.building.name}</span> <EditIcon/></li>
               : <li className={styles['detailed__list-item-action']}><span>Место проведения: не установлено</span> <EditIcon/></li>
               }
            </ul>

        </div>
    )
}

export default DetailedEventInfo