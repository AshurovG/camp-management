import React from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useBuildingDetailed, setBuildingDetailedAction } from 'slices/BuildingsSlice';
import styles from './BuildingsDetailedPage.module.scss'


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
            detailed
        </div>
    </div>
  )
}

export default BuildingsDetailedPage