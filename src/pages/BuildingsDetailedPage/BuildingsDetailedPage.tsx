import React from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useBuildingDetailed, setBuildingDetailedAction } from 'slices/BuildingsSlice';
import styles from './BuildingsDetailedPage.module.scss'
import CustomTable from 'components/CustomTable';

let roomsColumns = [
  {
    key: 'number',
    title: 'Номер комнаты'
  },
  {
    key: 'capacity',
    title: 'Вместимость'
  }
]

const BuildingsDetailedPage = () => {
  const params = useParams();
  const id = params.id === undefined ? '' : params.id;

  const dispatch = useDispatch();
  const buildingDetailed = useBuildingDetailed();
  
  const getDetailedBuilding = async () => {
    try {
      const response = await axios(`https://specializedcampbeta.roxmiv.com/api/buildings/${id}/detailed`, {
        method: 'GET'
      })

      dispatch(setBuildingDetailedAction({
        id: response.data.id,
        name: response.data.name,
        rooms: response.data.rooms,
        publicPlaces: response.data.public_places
      }))
    } catch(e) {
      throw e
    }
  }

  React.useEffect(() => {
    getDetailedBuilding();
  }, [])

  return (
    <div className={styles.detailed__page}>
        <div className={styles['detailed__page-wrapper']}>
            {buildingDetailed?.rooms.length !== 0 && <div className={styles['detailed__page-item']}>
              <h1 className={styles['detailed__page-title']}>Список комнат</h1>
                <CustomTable className={styles['events__page-table']} data={buildingDetailed?.rooms!} 
                columns={roomsColumns} flag={2} 
                 ></CustomTable>
            </div>}

            <div className={styles['detailed__page-item']}>
              <h1 className={styles['detailed__page-title']}>Список различных помещений</h1>
              <CustomTable className={styles['events__page-table']} data={buildingDetailed?.rooms!} 
                columns={roomsColumns} flag={2} 
              ></CustomTable>
            </div>
        </div>
    </div>
  )
}

export default BuildingsDetailedPage