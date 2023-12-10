import React, { useState, ChangeEvent, MouseEventHandler} from 'react'
import cn from 'classnames';
import styles from './SearchList.module.scss'
import { Form } from 'react-bootstrap';
import { RecGroupsData, UserData} from '../../../types';
import { useDispatch } from 'react-redux';
import { useUsers } from 'slices/GroupsSlice';
import Button from 'components/Button';

export type ListProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    allUsers?: boolean;
    members?: UserData[] | undefined;
    subgroups?: RecGroupsData[] | undefined;
    onMemberClick?: (id: number) => void;
    onSubgroupClick?: (id: number) => void;
    activeMembers?: number[];
    activeSubgroups?: number[];
    withActionBlock?: boolean;
    className?: string;
};

const SearchList: React.FC<ListProps> = ({allUsers, subgroups, members, onMemberClick, onSubgroupClick, 
    activeMembers, activeSubgroups, withActionBlock, className}) => {
    const users = useUsers()
    const [inputValue, setInputValue] = useState('')
    const [filteredMembers, setFilteredMembers] = useState<UserData[]>()
    const [filteredSubgroups, setFilteredSubgroups] = useState<RecGroupsData[] | undefined>(subgroups)
    const [showingMode, setShowingMode] = useState<'groups' | 'users' | 'all'>('all')

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
          console.log('filtered value is',  values.filter((value) => {
            const firstNameMatch = value.firstName.toLowerCase().includes(inputValue.toLowerCase());
            const lastNameMatch = value.lastName.toLowerCase().includes(inputValue.toLowerCase());
            return firstNameMatch || lastNameMatch;
          }))
        }
    };

    React.useEffect(() => {
        if (subgroups && inputValue !== undefined) {
            subgroupSearch()
        }

        if (members && inputValue !== undefined) {
            memberSearch(members)
        }

        if (!members && inputValue !== undefined) {
            console.log()
            memberSearch(users)
            console.log('member не передан')
        } else if (!members && inputValue === undefined) {
            setFilteredMembers(users)
        }
    }, [inputValue])

    return (
        <div className={cn(styles.list, className)}>
            {withActionBlock && <div className={styles.list__action}>
                <Button onClick={() => setShowingMode('groups')} className={styles['list__action-btn']}>Группы</Button>
                <Button onClick={() => setShowingMode('users')} className={styles['list__action-btn']}>Участники</Button>
                <Button onClick={() => setShowingMode('all')} className={styles['list__action-btn']}>Все</Button>
            </div>}
            <div className={styles.list__wrapper}>
                <Form.Control type="text" placeholder="Поиск*" value={inputValue} onChange={(event: ChangeEvent<HTMLInputElement>) => setInputValue(event.target.value)} style={{ width: '100%', position: 'sticky', top: 0, zIndex: 1}} />
                { !allUsers ?
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
                : inputValue ? <ul className={styles.list__options}> {filteredMembers?.map((member) => (
                    <li
                        onClick={() => onMemberClick && onMemberClick(member.id)}
                        className={activeMembers?.includes(member.id) ? `${styles.list__option} ${styles['list__option-active']}` : styles.list__option}
                    >
                        {`${member.firstName} ${member.lastName}`}
                    </li>
                    ))}
                </ul>
                : <ul className={styles.list__options}> {users.map((member) => (
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