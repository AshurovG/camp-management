import React, { useState, ChangeEvent } from 'react'
import styles from './BuildingsPage.module.scss'
import axios from 'axios'
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useBuildings, setBuildingsAction } from 'slices/BuildingsSlice';
import Button from 'components/Button';
import Form from 'react-bootstrap/Form';
import ModalWindow from 'components/ModalWindow';

const BuildingsPage = () => {
  const dispatch = useDispatch();
  const buildings = useBuildings();
  const [isAddModalWindowOppened, setIsAddModalWindowOppened] = useState(false)
  const [titleValue, setTitleValue] = useState('');

  const getBuildings = async () => {
    try {
      const response = await axios('https://specializedcampbeta.roxmiv.com/api/buildings', {
        method: 'GET'
      })
      
      dispatch(setBuildingsAction(response.data))

    } catch(e) {
      throw e
    }
  }

  const postBuilding = async () => {
    try {
      const response = await axios('https://specializedcampbeta.roxmiv.com/api/buildings', {
        method: 'POST',
        data: {
          "name": titleValue
        }
      })

      dispatch(setBuildingsAction([...buildings, response.data]))
    } catch(e) {
      throw(e)
    }
  }

  const putBuilding = async (id: number, title: string) => {
    try {
      const response = await axios(`https://specializedcampbeta.roxmiv.com/api/buildings/${id}`, {
        method: 'PUT',
        data: {
          "name": title
        }
      })

      dispatch(setBuildingsAction([...buildings, response.data]))
    } catch(e) {
      throw(e)
    }
  }

  const deleteBuilding = async (id: number) => {
    try {
      const response = await axios(`https://specializedcampbeta.roxmiv.com/api/buildings/${id}`, {
        method: 'DELETE'
      })
    } catch(e) {
      throw e
    }
  }

  React.useEffect(() => {
    getBuildings()
  }, [])

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

  return (
    <div className={styles.accommodation_page}>
        <div className={styles['accommodation__page-wrapper']}>
            <h1 className={styles['accommodation__page-title']}>Здания лагеря</h1>
            <div className={styles['accommodation__page-content']}>
              <Button onClick={() => setIsAddModalWindowOppened(true)}>Добавить</Button>
              <div className={styles['accommodation__page-cards']}>
                {buildings.map((building) => (
                  <Link to={`/buildings/${building.id}`} className={styles['accommodation__page-card']}>
                    {building.name}
                  </Link>
                ))}
              </div>
            </div>
        </div>
        <ModalWindow handleBackdropClick={() => {setIsAddModalWindowOppened(false)}} className={styles.modal} active={isAddModalWindowOppened}>
          <h3 className={styles.modal__title}>Заполните данные</h3>
          <Form onSubmit={handleFormSubmit}>
            <div className={styles.form__item}>
              <Form.Group style={{height: 50}} className='mb-3' controlId="search__sub.input__sub">
                  <Form.Control onChange={(event: ChangeEvent<HTMLInputElement>) => setTitleValue(event.target.value)} value={titleValue} style={{height: '100%', borderColor: '#3D348B', fontSize: 18}} type="email" placeholder="Название*" />
              </Form.Group>
            </div>
            <Button className={styles.form__btn}>Сохранить</Button>
          </Form>
        </ModalWindow>
    </div>
  )
}

export default BuildingsPage