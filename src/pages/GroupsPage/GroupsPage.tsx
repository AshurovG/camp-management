import React from 'react';
import axios from 'axios';
import styles from './GroupsPage.module.scss'
import { useDispatch } from 'react-redux';
import { useGroups, setGroupsAction } from 'slices/GroupsSlice';

const GroupsPage = () => {
  const dispatch = useDispatch();
  const groups = useGroups(); 

  const getGroups = async () => {
    try {
      const response = await axios(`https://specializedcampbeta.roxmiv.com/api/groups`)
      dispatch(setGroupsAction(response.data))
    } catch(e) {
      throw e
    }
  }

  React.useEffect(() => {
    getGroups()
  }, [])

  return (
    <div className={styles.groups__page}>
        <div className={styles['groups__page-wrapper']}>
            GroupsPage
        </div>
    </div>
  )
}

export default GroupsPage;