import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
import styles from './GroupsPage.module.scss'
import { RecGroupsData, RecUserData, UserData } from '../../../types';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useGroups, useUsers, useDetailedGroup, useFilteredUsers, useFilteredGroups,
  setGroupsAction, setUsersAction, setDetailedGroupAction,
  setFilteredUsersAction, setFilteredGroupsAction } from 'slices/GroupsSlice';
import AddButton from 'components/Icons/AddButton';
import Button from 'components/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import ArrowDownIcon from 'components/Icons/ArrowDownIcon';
import ArrowIcon from 'components/Icons/ArrowIcon';
import BasketIcon from 'components/Icons/BasketIcon';
import EditIcon from 'components/Icons/EditIcon';
import ModalWindow from 'components/ModalWindow';
import SearchList from 'components/SearchList';
import Form from 'react-bootstrap/Form';
import Loader from 'components/Loader';


const GroupsPage = () => {
  const dispatch = useDispatch();
  const groups = useGroups(); 
  const users = useUsers();
  const detailedGroup = useDetailedGroup();
  const filteredUsers = useFilteredUsers();
  const filteredGroups = useFilteredGroups();
  const [groupValue, setGroupValue] = useState<RecGroupsData>()
  const [addedSubgroups, setAddedSubgroups] = useState<number[]>([])
  const [addedMembers, setAddedMembers] = useState<number[]>([])
  const [deletedSubgroups, setDeletedSubgroups] = useState<number[]>([])
  const [deletedMembers, setDeletedMembers] = useState<number[]>([])
  const [isAddModalWindowOpened, setIsAddModalWindowOpened] = useState(false)
  const [isEditModalWindowOpened, setIsEditModalWindowOpened] = useState(false)
  const [isAllGroupsLoading, setIsAllGroupsLoading] = useState(true)
  const [isDetailedGroupLoading, setIsDetailedGroupLoading] = useState(true)
  const [isDeleteModalWindowOpened, setIsDeleteModalWindowOpened] = useState(false)

  const [newGroupValue, setNewGroupValue] = useState('')

  const getGroups = async () => {
    try {
      const response = await axios(`https://specializedcampbeta.roxmiv.com/api/groups`)
      dispatch(setGroupsAction(response.data))
      if (!groupValue) {
        setGroupValue(response.data[0])
      }
    } catch(e) {
      throw e
    }

    setIsAllGroupsLoading(false)
  }

  const getUsers = async () => {
    try {
      const response = await axios(`https://specializedcampbeta.roxmiv.com/api/users`, {
        method: 'GET'
      })

      const newUsersArr = response.data.map((raw: RecUserData) => {
        return {
          id: raw.id,
          firstName: raw.first_name,
          lastName: raw.last_name
        }
      })

      dispatch(setUsersAction(newUsersArr))

    } catch(e) {
      throw e
    }
  }

  const getDetailedGroup = async (id: number) => {
    try {
      const response = await axios(`https://specializedcampbeta.roxmiv.com/api/groups/${id}/detailed`, {
        method: 'GET'
      })

      const newMembersArr = response.data.members.map((raw: RecUserData) => {
        return {
          id: raw.id,
          firstName: raw.first_name,
          lastName: raw.last_name
        }
      })

      const newAllMembersArr = response.data.all_members.map((raw: RecUserData) => {
        return {
          id: raw.id,
          firstName: raw.first_name,
          lastName: raw.last_name
        }
      })
      dispatch(setDetailedGroupAction({
        members: newMembersArr,
        allMembers: newAllMembersArr,
        childrenGroups: response.data.children_groups,
        allChildrenGroups: response.data.all_children_groups
      }))
      dispatch(setFilteredGroupsAction(filterGroups(groups, response.data.all_children_groups)))
      dispatch(setFilteredUsersAction(filterUsers(users, newAllMembersArr)))
      setIsDetailedGroupLoading(false)
      
    } catch(e) {
      throw e
    }
  }

  const postGroup = async () => {
    try {
      const response = await axios(`https://specializedcampbeta.roxmiv.com/api/groups`, {
        method: 'POST',
        data: {
          "name": newGroupValue
        }
      })
    setGroupValue(response.data)
    toast.success("Группа успешно добавлена!");
      
    } catch(e) {
      throw e
    } finally {
      setIsAllGroupsLoading(true)
      await getGroups()
      if (groupValue) {
        setIsDetailedGroupLoading(true)
        await getDetailedGroup(groupValue.id)
      }
    }
  }

  const putGroup = async () => {
    try {
      const response = await axios(`https://specializedcampbeta.roxmiv.com/api/groups/${groupValue?.id}`, {
        method: 'PUT',
        data: {
          "name": newGroupValue
        }
      })
      const updatedGroups = groups.map(group => {
        if (group.id === groupValue?.id) {
          return {
            ...group,
            name: newGroupValue
          };
        }
        return group;
      });
      setGroupValue(response.data)
      dispatch(setGroupsAction(updatedGroups))
      toast.success("Группа успешно отредактирована!");
    } catch(e) {
      throw e
    }
  }

  const deleteGroup = async () => {
    try {
      await axios(`https://specializedcampbeta.roxmiv.com/api/groups/${groupValue?.id}`, {
        method: 'DELETE'
      })
      if (groups.length > 0 && groupValue?.id !== groups[0].id) {
        setGroupValue(groups[0])
      } else if (groups.length > 1 && groupValue?.id === groups[0].id) {
        setGroupValue(groups[1])
      }
      dispatch(setGroupsAction(groups.filter(group => group.id !== groupValue?.id)));
      
    } catch(e) {
      throw e
    } finally {
      if (groupValue) {
        setIsDetailedGroupLoading(true)
        await getDetailedGroup(groupValue.id)
      }
    }
  }

  const addMembersToGroup = async () => {
    try {
      await axios(`https://specializedcampbeta.roxmiv.com/api/groups/${groupValue?.id}/add_members`, {
        method: 'PATCH' ,
        data: addedMembers
      })
    } catch(e) {
      throw e
    } finally {
      if (groupValue) {
        setIsDetailedGroupLoading(true)
        await getDetailedGroup(groupValue.id)
      }
    }
  }

  const addSubGroupsToGroup = async () => {
    try {
      await axios(`https://specializedcampbeta.roxmiv.com/api/groups/${groupValue?.id}/add_children`, {
        method: 'PATCH' ,
        data: addedSubgroups
      })
    } catch(e) {
      throw e
    } finally {
      if (groupValue) {
        setIsDetailedGroupLoading(true)
        await getDetailedGroup(groupValue.id)
      }
    }
  }

  const deleteMembers = async () => {
    try {
      await axios(`https://specializedcampbeta.roxmiv.com/api/groups/${groupValue?.id}/remove_members`, {
        method: 'PATCH',
        data: deletedMembers
      })
    } catch(e) {
      throw e
    } finally {
      if (groupValue) {
        setIsDetailedGroupLoading(true)
        await getDetailedGroup(groupValue.id)
      }
    }
  }

  const deleteSubgroups = async () => {
    try {
      await axios(`https://specializedcampbeta.roxmiv.com/api/groups/${groupValue?.id}/remove_children`, {
        method: 'PATCH',
        data: deletedSubgroups
      })
    } catch(e) {
      throw e
    } finally {
      if (groupValue) {
        setIsDetailedGroupLoading(true)
        await getDetailedGroup(groupValue.id)
      }
    }
  }

  React.useEffect(() => {
    getGroups();
    getUsers();
  }, [])

  React.useEffect(() => {
    if (groupValue) {
      getDetailedGroup(groupValue.id)
    }
  }, [groupValue])

  const filterGroups = (groups: RecGroupsData[], subgroups: RecGroupsData[]) => {
    let filteredArr =  groups.filter((group: RecGroupsData) => {
      return !subgroups.some((subgroup: RecGroupsData) => subgroup.id === group.id);
    });

    return filteredArr.filter((group: RecGroupsData) => {
      return group !== groupValue
    })
  };

  const filterUsers = (users: UserData[], currentUsers: UserData[]) => {
    return users.filter((user: UserData) => {
      return !currentUsers.some((currentUser: UserData) => currentUser.id === user.id);
    });
  };

  const clearData = () => {
    setAddedMembers([])
    setDeletedMembers([])
    setAddedSubgroups([])
    setDeletedSubgroups([])
  }

  const handleGroupSelect = (eventKey: string | null) => {
    setIsDetailedGroupLoading(true)
    if (eventKey !== null) {
      const selectedGroup = groups.find(group => group.id === parseInt(eventKey, 10));
      if (selectedGroup) {
        setGroupValue(selectedGroup)
      }
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isAddModalWindowOpened) {
      postGroup()
    } else {
      putGroup()
    }
    setNewGroupValue('')
    setIsAddModalWindowOpened(false)
    setIsEditModalWindowOpened(false)
  }

  const handleEditButtonClick = () => {
    setIsEditModalWindowOpened(true);
    if (groupValue) {
      setNewGroupValue(groupValue.name)
    }
  }

  const handleAddArrowClick = () => {
    clearData()
    if (addedMembers.length !== 0) {
      addMembersToGroup()
    }

    if (addedSubgroups.length !== 0) {
      addSubGroupsToGroup() 
    }
  }

  const handleDeleteArrowClick = () => {
    clearData()
    if (deletedMembers.length !== 0) {
      deleteMembers()
    }

    if (deletedSubgroups.length !== 0) {
      deleteSubgroups()
    }
  }

  const handleSubgroupAdd = (id: number) => {
    if (addedSubgroups.includes(id)) {
      setAddedSubgroups(addedSubgroups.filter(subgroupId => subgroupId !== id));
      console.log('removed', id);
    } else {
      setAddedSubgroups([...addedSubgroups, id]);
      console.log('added', id);
    }
  };
  
  const handleMemberAdd = (id: number) => {
    if (addedMembers.includes(id)) {
      setAddedMembers(addedMembers.filter(memberId => memberId !== id));
      console.log('removed', id);
    } else {
      setAddedMembers([...addedMembers, id]);
      console.log('added', id);
    }

    console.log(addedMembers)
  };

  const handleSubgroupDelete = (id: number) => {
    if (deletedSubgroups.includes(id)) {
      setDeletedSubgroups(deletedSubgroups.filter(subgroupId => subgroupId !== id));
      console.log('removed', id);
    } else {
      setDeletedSubgroups([...deletedSubgroups, id]);
      console.log('added', id);
    }
  }

  const handleMemberDelete = (id: number) => {
    if (deletedMembers.includes(id)) {
      setDeletedMembers(deletedMembers.filter(memberId => memberId !== id));
      console.log('removed', id);
    } else {
      setDeletedMembers([...deletedMembers, id]);
      console.log('added', id);
    }
  }

  return (
    <div className={styles.groups__page}>
        <div className={styles['groups__page-wrapper']}>
        <h1 className={styles['groups__page-title']}>Состав лагеря</h1>
          {(isDetailedGroupLoading || isAllGroupsLoading) ? <div className={styles.loader__wrapper}>
              <Loader className={styles.loader} size='l' />
          </div>
            :<div>
             <h4 className={styles['groups__page-subtitle']}>Выберите группу</h4>
             <div className={styles['groups__page-action']}>
              <Dropdown className={styles['dropdown']} onSelect={handleGroupSelect}>
                  <Dropdown.Toggle
                      className={styles['dropdown__toggle']}
                      style={{
                          borderColor: '#000',
                          backgroundColor: "#fff",
                          color: '#000',
                      }}
                  >   
                      {groupValue?.name}
                      <ArrowDownIcon className={styles.dropdown__icon}/>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className={styles['dropdown__menu']}>
                      {groups.map(group => (
                          <Dropdown.Item className={styles['dropdown__menu-item']} key={group.id} eventKey={group.id}>{group.name}</Dropdown.Item>
                      ))}
                  </Dropdown.Menu>
              </Dropdown>
              <AddButton onClick={() => {setIsAddModalWindowOpened(true); clearData()}}/>
              <EditIcon onClick={handleEditButtonClick}/>
              <BasketIcon onClick={() => setIsDeleteModalWindowOpened(true)}/>
            </div>
            <h4 className={styles['groups__page-subtitle']}>Здесь вы можете изменять состав группы</h4>
            <div className={styles['groups__page-detailed']}>    
              <SearchList members={filteredUsers} subgroups={filteredGroups} onSubgroupClick={handleSubgroupAdd} onMemberClick={handleMemberAdd}
              activeMembers={addedMembers} activeSubgroups={addedSubgroups}/>
              <div className={styles['groups__page-detailed-btns']}>
                <Button onClick={handleAddArrowClick}><ArrowIcon/></Button>
                <Button onClick={handleDeleteArrowClick} className={styles['groups__page-detailed-reverse']}><ArrowIcon/></Button>
              </div>
              <SearchList members={detailedGroup.members} subgroups={detailedGroup.childrenGroups} onSubgroupClick={handleSubgroupDelete} onMemberClick={handleMemberDelete}
              activeMembers={deletedMembers} activeSubgroups={deletedSubgroups}/>
            </div>
          </div>}
        </div>
        <ModalWindow handleBackdropClick={() => {setIsAddModalWindowOpened(false); setIsEditModalWindowOpened(false); newGroupValue && setNewGroupValue('')}} className={styles.modal} active={isAddModalWindowOpened || isEditModalWindowOpened}>
          <h3 className={styles.modal__title}>Заполните данные</h3>
          <Form onSubmit={(event: React.FormEvent<HTMLFormElement>) => handleFormSubmit(event)}
          className={styles['form']}>
            <div className={styles.form__item}>
              <Form.Group style={{height: 50}} className='mb-3' controlId="search__sub.input__sub">
                <Form.Control onChange={(event: ChangeEvent<HTMLInputElement>) => setNewGroupValue(event.target.value)} value={newGroupValue} style={{height: '100%', borderColor: '#3D348B', fontSize: 18}} type="text" placeholder="Название*" />
              </Form.Group>
            </div>
            <Button disabled={newGroupValue ? false : true} type='submit'>Сохранить</Button>
          </Form>
      </ModalWindow>

      <ModalWindow handleBackdropClick={() => setIsDeleteModalWindowOpened(false)} active={isDeleteModalWindowOpened} className={styles.modal}>
        <h3 className={styles.modal__title}>Вы уверены, что хотите удалить данное мероприятние?</h3>
        <div className={styles.modal__btns}>
          <Button onClick={() => {deleteGroup(); clearData(); setIsDeleteModalWindowOpened(false)}} className={styles.modal__btn}>Подтвердить</Button>
          <Button onClick={() => setIsDeleteModalWindowOpened(false)} className={styles.modal__btn}>Закрыть</Button>
        </div>
      </ModalWindow>
    </div>
  )
}

export default GroupsPage;