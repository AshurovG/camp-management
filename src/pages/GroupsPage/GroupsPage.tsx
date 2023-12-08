import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
import styles from './GroupsPage.module.scss'
import { useDispatch } from 'react-redux';
import { useGroups, useUsers, useAllMembers, useAllSubgroups, useFilteredUsers, useFilteredGroups,
  setGroupsAction, setUsersAction, setAllMembersAction, setAllSubgroupsAction,
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
import { RecGroupsData, RecUserData, UserData } from '../../../types';

const GroupsPage = () => {
  const dispatch = useDispatch();
  const groups = useGroups(); 
  const users = useUsers();
  const allMembers = useAllMembers();
  const allSubgroups = useAllSubgroups();
  const filteredUsers = useFilteredUsers();
  const filteredGroups = useFilteredGroups();
  const [groupValue, setGroupValue] = useState<RecGroupsData>()
  const [addedSubgroups, setAddedSubgroups] = useState<number[]>([])
  const [addedMembers, setAddedMembers] = useState<number[]>([])
  const [deletedSubgroups, setDeletedSubgroups] = useState<number[]>([])
  const [deletedMembers, setDeletedMembers] = useState<number[]>([])
  const [isAddModalWindowOpened, setIsAddModalWindowOpened] = useState(false)
  const [isEditModalWindowOpened, setIsEditModalWindowOpened] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [newGroupValue, setNewGroupValue] = useState('')

  const getGroups = async () => {
    try {
      const response = await axios(`https://specializedcampbeta.roxmiv.com/api/groups`)
      dispatch(setGroupsAction(response.data))
      setGroupValue(response.data[0])
      // getDetailedGroup(response.data[0].id);
    } catch(e) {
      throw e
    }
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
      dispatch(setAllMembersAction(newMembersArr))
      dispatch(setAllSubgroupsAction(response.data.children_groups))
      dispatch(setFilteredGroupsAction(filterGroups(groups, response.data.children_groups)))
      dispatch(setFilteredUsersAction(filterUsers(users, newMembersArr)))
      setIsLoading(false)
      
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
      dispatch(setGroupsAction([...groups, response.data]))
    } catch(e) {
      throw e
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
    } catch(e) {
      throw e
    }
  }

  const deleteGroup = async () => {
    try {
      await axios(`https://specializedcampbeta.roxmiv.com/api/groups/${groupValue?.id}`, {
        method: 'DELETE'
      })
      dispatch(setGroupsAction(groups.filter(group => group.id !== groupValue?.id)));
      setGroupValue(groups[0])
    } catch(e) {
      throw e
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
    return groups.filter((group: RecGroupsData) => {
      return !subgroups.some((subgroup: RecGroupsData) => subgroup.id === group.id);
    });
  };

  const filterUsers = (users: UserData[], currentUsers: UserData[]) => {
    return users.filter((user: UserData) => {
      return !currentUsers.some((currentUser: UserData) => currentUser.id === user.id);
    });
  };


  const handleGroupSelect = (eventKey: string | null) => {
    setIsLoading(true)
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
             <h1 className={styles['groups__page-title']}>Группы и участники</h1>
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
              <AddButton onClick={() => setIsAddModalWindowOpened(true)}/>
              <EditIcon onClick={handleEditButtonClick}/>
              <BasketIcon onClick={() => deleteGroup()}/>
             </div>

             {/* {users.length !== 0 && groups.length !== 0 && allSubgroups.length !== 0 && allMembers.length !== 0 && <div className={styles['groups__page-detailed']}>
                <SearchList members={users} subgroups={groups} onSubgroupClick={handleSubgroupAdd} onMemberClick={handleMemberAdd}
                activeMembers={addedMembers} activeSubgroups={addedSubgroups}/>
                <div className={styles['groups__page-detailed-btns']}>
                  <Button><ArrowIcon/></Button>
                  <Button className={styles['groups__page-detailed-reverse']}><ArrowIcon/></Button>
                </div>
                <SearchList members={allMembers} subgroups={allSubgroups} onSubgroupClick={handleSubgroupDelete} onMemberClick={handleMemberDelete}
                activeMembers={deletedMembers} activeSubgroups={deletedSubgroups}/>
             </div>} */}

            
            {isLoading ? <div className={styles.loader__wrapper}>
                            <Loader className={styles.loader} size='l' />
                        </div>
            :
            <div className={styles['groups__page-detailed']}>
                <SearchList members={filteredUsers} subgroups={filteredGroups} onSubgroupClick={handleSubgroupAdd} onMemberClick={handleMemberAdd}
                activeMembers={addedMembers} activeSubgroups={addedSubgroups}/>
                <div className={styles['groups__page-detailed-btns']}>
                  <Button><ArrowIcon/></Button>
                  <Button className={styles['groups__page-detailed-reverse']}><ArrowIcon/></Button>
                </div>
                <SearchList members={allMembers} subgroups={allSubgroups} onSubgroupClick={handleSubgroupDelete} onMemberClick={handleMemberDelete}
                activeMembers={deletedMembers} activeSubgroups={deletedSubgroups}/>
            </div>}
        </div>
        <ModalWindow handleBackdropClick={() => {setIsAddModalWindowOpened(false); setIsEditModalWindowOpened(false)}} className={styles.modal} active={isAddModalWindowOpened || isEditModalWindowOpened}>
          <h3 className={styles.modal__title}>Заполните данные</h3>
          <Form onSubmit={(event: React.FormEvent<HTMLFormElement>) => handleFormSubmit(event)}
          className={styles['form']}>
            <div className={styles.form__item}>
              <Form.Group style={{height: 50}} className='mb-3' controlId="search__sub.input__sub">
                <Form.Control onChange={(event: ChangeEvent<HTMLInputElement>) => setNewGroupValue(event.target.value)} value={newGroupValue} style={{height: '100%', borderColor: '#3D348B', fontSize: 18}} type="text" placeholder="Название*" />
              </Form.Group>
            </div>
            <Button type='submit'>Сохранить</Button>
          </Form>
      </ModalWindow>
    </div>
  )
}

export default GroupsPage;