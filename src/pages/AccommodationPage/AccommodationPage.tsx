import React from 'react'
import styles from './AccommodationPage.module.scss'

const AccommodationPage = () => {
  return (
    <div className={styles.accommodation_page}>
        <div className={styles['accommodation__page-wrapper']}>
            <h1 className={styles['accommodation__page-title']}>Проживание</h1>
        </div>
    </div>
  )
}

export default AccommodationPage