import React, { useState, ChangeEvent} from 'react'
import cn from 'classnames';
import axios from 'axios';
import styles from './SearchList.module.scss'
import { Form } from 'react-bootstrap';
import { RecGroupsData, UserData, RecUserData} from '../../../types';
import { useUsers, useGroups, useUsersWithoutRoom } from 'slices/GroupsSlice';
import Button from 'components/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import ArrowDownIcon from 'components/Icons/ArrowDownIcon';
import {API_URL} from 'components/urls';

export type ListProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    allUsers?: boolean;
    members?: UserData[] | undefined;
    subgroups?: RecGroupsData[] | undefined;
    onMemberClick?: (id: number) => void;
    onSubgroupClick?: (id: number) => void;
    activeMembers?: number[];
    activeSubgroups?: number[];
    withActionBlock?: boolean;
    areUsersWithoutRooms?: boolean;
    isCounterNeed?: boolean;
    className?: string;
    children?: React.ReactNode
};

const SearchList: React.FC<ListProps> = ({allUsers, subgroups, members, onMemberClick, onSubgroupClick, 
    activeMembers, activeSubgroups, withActionBlock, areUsersWithoutRooms, isCounterNeed, children, className}) => {
    const users = useUsers()
    const groups = useGroups()
    const usersWithoutRoom = useUsersWithoutRoom()
    const [inputValue, setInputValue] = useState('')
    const [filteredMembers, setFilteredMembers] = useState<UserData[]>()
    const [filteredSubgroups, setFilteredSubgroups] = useState<RecGroupsData[] | undefined>(subgroups)
    const [showingMode, setShowingMode] = useState<'groups' | 'users' | 'all'>('all')
    const [groupValue, setGroupValue] = useState<RecGroupsData>({
        id: 0,
        name: 'Все'
    })
    const [usersFromSelectedGroup, setUsersFromSelectedGroup] = useState<UserData[]>(usersWithoutRoom)

    const subgroupSearch = () => {
        if (subgroups !== undefined) {
            setFilteredSubgroups(subgroups.filter((subgroup) => {
                return subgroup.name.toLowerCase().includes(inputValue.toLowerCase());
            }));
        }
    };

    const memberSearch = (values: UserData[]) => {
        if (values !== undefined) {
          setFilteredMembers(
            values.filter((value) => {
              const firstNameMatch = value.firstName.toLowerCase().includes(inputValue.toLowerCase());
              const lastNameMatch = value.lastName.toLowerCase().includes(inputValue.toLowerCase());
              return firstNameMatch || lastNameMatch;
            })
          );
        }
    };

    const getUsersFromGroup = async (id: number) => {
        try {
            const response = await axios(API_URL + `groups/${id}/members/without_room`, {
                method: 'GET',
                withCredentials: true
            })
            let newArr = []
            if (response.data.length > 0) {
                newArr = response.data.map((member: RecUserData) => {
                    return {
                        id: member.id,
                        firstName: member.first_name,
                        lastName: member.last_name
                    }
                })
            }


            setUsersFromSelectedGroup(newArr)
        } catch(e) {
            throw e
        }
    }

    const handleGroupSelect = (eventKey: string | null) => {
        setInputValue('')
        if (eventKey === 'all') {
            setUsersFromSelectedGroup(usersWithoutRoom)
        }
        if (eventKey !== null) {
          const selectedGroup = groups.find(group => group.id === parseInt(eventKey, 10));
          if (selectedGroup && selectedGroup.id !== groupValue?.id) {
            setGroupValue(selectedGroup)
            getUsersFromGroup(Number(eventKey))
          } else {
            setGroupValue({
                id: 0,
                name: 'Все'
            })
          }
        }
      };

    React.useEffect(() => {
        if (!inputValue && !allUsers) {
            setFilteredMembers(members)
            setFilteredSubgroups(subgroups)
        }
         if (subgroups && inputValue) {
            subgroupSearch()
        }

        if (members && inputValue) {
            memberSearch(members)
        }

        if (allUsers && inputValue) {
            memberSearch(users)
        }

        if (areUsersWithoutRooms && inputValue) {
            memberSearch(usersFromSelectedGroup)
        }

    }, [inputValue])

    return (
        <div className={cn(styles.list, className)}>
            {withActionBlock && <div className={styles.list__action}>
                <Button onClick={() => setShowingMode('groups')} className={styles['list__action-btn']}>Группы</Button>
                <Button onClick={() => setShowingMode('users')} className={styles['list__action-btn']}>Участники</Button>
                <Button onClick={() => setShowingMode('all')} className={styles['list__action-btn']}>Все</Button>
            </div>}
            {children}
            {isCounterNeed && <p>Участников: {members?.length}, подрупп: {subgroups?.length}</p>}
            <div className={styles.list__wrapper}>
                <div className={styles.list__filter} style={{ width: '100%', position: 'sticky', top: 0, zIndex: 1}}>
                {areUsersWithoutRooms && <Dropdown className={styles['dropdown']} onSelect={handleGroupSelect}>
                        <Dropdown.Toggle
                            className={styles['dropdown__toggle']}
                            style={{
                                borderColor: '#000',
                                backgroundColor: "#fff",
                                color: '#000',
                            }}
                        >   
                        {groupValue ? groupValue?.name : "Все"}
                        <ArrowDownIcon className={styles.dropdown__icon}/>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className={styles['dropdown__menu']}>
                        <Dropdown.Item
                        className={styles['dropdown__menu-item']}
                        key="all"
                        eventKey="all">Все</Dropdown.Item>
                            {groups.map(group => (
                                <Dropdown.Item className={styles['dropdown__menu-item']} key={group.id} eventKey={group.id}>{group.name}</Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>}
                    <Form.Control type="text" placeholder="Поиск*" value={inputValue} onChange={(event: ChangeEvent<HTMLInputElement>) => setInputValue(event.target.value)} className={styles['list__filter-input']}/>
                </div>
                {!allUsers && !areUsersWithoutRooms ?
                    <ul className={styles.list__options}>
                    {filteredSubgroups && (showingMode === 'all' || showingMode === 'groups')
                    ? filteredSubgroups.map((subgroup) => (
                        <li
                            onClick={() => onSubgroupClick && onSubgroupClick(subgroup.id)}
                            className={activeSubgroups?.includes(subgroup.id) ? `${styles.list__option} ${styles['list__option-active']}` : styles.list__option}
                        >
                            {subgroup.name}
                        </li>
                        ))
                    : (showingMode === 'all' || showingMode === 'groups') && subgroups?.map((subgroup) => (
                        <li
                            onClick={() => onSubgroupClick && onSubgroupClick(subgroup.id)}
                            className={activeSubgroups?.includes(subgroup.id) ? `${styles.list__option} ${styles['list__option-active']}` : styles.list__option}
                        >
                            {subgroup.name}
                        </li>
                        ))}

                    {filteredMembers && (showingMode === 'all' || showingMode === 'users')
                    ? filteredMembers.map((member) => (
                        <li
                            onClick={() => onMemberClick && onMemberClick(member.id)}
                            className={activeMembers?.includes(member.id) ? `${styles.list__option} ${styles['list__option-active']}` : styles.list__option}
                        >
                            {`${member.firstName} ${member.lastName}`}
                        </li>
                        ))
                    : (showingMode === 'all' || showingMode === 'users') && members?.map((member) => (
                        <li
                            onClick={() => onMemberClick && onMemberClick(member.id)}
                            className={activeMembers?.includes(member.id) ? `${styles.list__option} ${styles['list__option-active']}` : styles.list__option}
                        >
                            {`${member.firstName} ${member.lastName}`}
                        </li>
                        ))}
                    </ul>
                : inputValue && allUsers ? <ul className={styles.list__options}> {filteredMembers?.map((member) => (
                    <li
                        onClick={() => onMemberClick && onMemberClick(member.id)}
                        className={activeMembers?.includes(member.id) ? `${styles.list__option} ${styles['list__option-active']}` : styles.list__option}
                    >
                        {`${member.firstName} ${member.lastName}`}
                    </li>
                    ))}
                </ul>
                : allUsers ? <ul className={styles.list__options}> {users.map((member) => (
                    <li
                        onClick={() => onMemberClick && onMemberClick(member.id)}
                        className={activeMembers?.includes(member.id) ? `${styles.list__option} ${styles['list__option-active']}` : styles.list__option}
                    >
                        {`${member.firstName} ${member.lastName}`}
                    </li>
                    ))}
                </ul>
                : inputValue && areUsersWithoutRooms ? <ul className={styles.list__options}> {filteredMembers?.map((member) => (
                    <li
                        onClick={() => onMemberClick && onMemberClick(member.id)}
                        className={activeMembers?.includes(member.id) ? `${styles.list__option} ${styles['list__option-active']}` : styles.list__option}
                    >
                        {`${member.firstName} ${member.lastName}`}
                    </li>
                    ))}
                </ul>
                : groupValue.name !== 'Все' ? <ul className={styles.list__options}> {usersFromSelectedGroup.map((member) => (
                    <li
                        onClick={() => onMemberClick && onMemberClick(member.id)}
                        className={activeMembers?.includes(member.id) ? `${styles.list__option} ${styles['list__option-active']}` : styles.list__option}
                    >
                        {`${member.firstName} ${member.lastName}`}
                    </li>
                    ))}
                </ul>
                : <ul className={styles.list__options}> {usersWithoutRoom.map((member) => (
                    <li
                        onClick={() => onMemberClick && onMemberClick(member.id)}
                        className={activeMembers?.includes(member.id) ? `${styles.list__option} ${styles['list__option-active']}` : styles.list__option}
                    >
                        {`${member.firstName} ${member.lastName}`}
                    </li>
                    ))}
                </ul>
                }
            </div>
            
        </div>
    )
}

export default SearchList