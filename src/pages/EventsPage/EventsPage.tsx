import React from 'react'
import { useState, ChangeEvent } from 'react'
import styles from './EventsPage.module.scss'
import CustomTable from 'components/CustomTable'
import Button from 'components/Button'
import Form from 'react-bootstrap/Form';
import ModalWindow from 'components/ModalWindow'
import { EventData } from '../../../types'

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
  const [isAddModalWindowOpened, setIsAddModalWindowOpened] = useState(false);
  const [isChangeModalWindowOpened, setIsChangeModalWindowOpened] = useState(false);
  const [titleValue, setTitleValue] = useState('');
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [place, setPlace] = useState('');

  const handleUsersButtonCLick = () => {
    console.log('users')
  }

  const handleChangeButtonClick = (event: EventData) => {
    setTitleValue(event.title);
    setTimeStart(event.timeStart);
    setTimeEnd(event.timeEnd);
    setPlace(event.place);
    setIsChangeModalWindowOpened(true);
  }

  const handleDeleteButtonClick = () => {
    console.log('delete')
  }

  const handleAddButtonClick = () => {
    setTitleValue('');
    setTimeStart('');
    setTimeEnd('');
    setPlace('');
    setIsAddModalWindowOpened(true);
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('form submited')
  }

  return (
    <div className={styles.events__page}>
      <div className={styles['events__page-wrapper']}>
        <h1 className={styles['events__page-title']}>Мероприятия на данный день</h1>
        <div className={styles['events__page-content']}>
          <Button onClick={handleAddButtonClick} className={styles['events__page-add']}>Добавить новое</Button>
          <CustomTable className={styles['events__page-table']} events={events} columns={columns} flag={2} handleChangeButtonClick={handleChangeButtonClick}></CustomTable>
        </div>
      </div>

      <ModalWindow handleBackdropClick={() => {setIsAddModalWindowOpened(false); setIsChangeModalWindowOpened(false)}} className={styles.modal} active={isAddModalWindowOpened || isChangeModalWindowOpened}>
        <h3 className={styles.modal__title}>Заполните данные</h3>
        <Form onSubmit={handleFormSubmit}
        className={styles['form']}>
          <div className={styles.form__item}>
              <Form.Group style={{height: 50}} className='mb-3' controlId="search__sub.input__sub">
                  <Form.Control onChange={(event: ChangeEvent<HTMLInputElement>) => setTitleValue(event.target.value)} value={titleValue} style={{height: '100%', borderColor: '#3D348B', fontSize: 18}} type="email" placeholder="Название*" />
                  {/* <span className={styles['form__item-error']}>{emailError !== 'init' && emailError}</span> */}
              </Form.Group>
          </div>
          <div className={styles.form__item}>
              <Form.Group style={{height: 50}} className='mb-3' controlId="search__sub.input__sub">
                  <Form.Control onChange={(event: ChangeEvent<HTMLInputElement>) => setTimeStart(event.target.value)} value={timeStart} style={{height: '100%', borderColor: '#3D348B', fontSize: 18}} type="text" placeholder="Время начала*" />
                  {/* <span className={styles['form__item-error']}>{fullnameError !== 'init' && fullnameError}</span> */}
              </Form.Group>
          </div>
          <div className={styles.form__item}>
              <Form.Group style={{height: 50}} className='mb-3' controlId="search__sub.input__sub">
                  <Form.Control onChange={(event: ChangeEvent<HTMLInputElement>) => setTimeEnd(event.target.value)} value={timeEnd} style={{height: '100%', borderColor: '#3D348B', fontSize: 18}} type="text" placeholder="Время начала*" />
                  {/* <span className={styles['form__item-error']}>{fullnameError !== 'init' && fullnameError}</span> */}
              </Form.Group>
          </div>
          <div className={styles.form__item}>
              <Form.Group style={{height: 50}} className='mb-3' controlId="search__sub.input__sub">
                  <Form.Control onChange={(event: ChangeEvent<HTMLInputElement>) => setPlace(event.target.value)} value={place} style={{height: '100%', borderColor: '#3D348B', fontSize: 18}} type="text" placeholder="Время начала*" />
                  {/* <span className={styles['form__item-error']}>{fullnameError !== 'init' && fullnameError}</span> */}
              </Form.Group>
          </div>
          {isAddModalWindowOpened && <Button className={styles.form__btn}>Сохранить</Button>}
          {isChangeModalWindowOpened && <Button className={styles.form__btn}>Изменить</Button>}
        </Form>
      </ModalWindow>
    </div>
  )
}
export default EventsPage