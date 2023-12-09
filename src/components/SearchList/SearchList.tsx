import React, { useState, ChangeEvent, MouseEventHandler} from 'react'
import cn from 'classnames';
import styles from './SearchList.module.scss'
import { Form } from 'react-bootstrap';
import { RecGroupsData, UserData} from '../../../types';
import { useDispatch } from 'react-redux';
import { useUsers } from 'slices/GroupsSlice';

export type ListProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    allUsers?: boolean;
    members?: UserData[] | undefined;
    subgroups?: RecGroupsData[] | undefined;
    onMemberClick?: (id: number) => void;
    onSubgroupClick?: (id: number) => void;
    getFilteredMembers?: () => void;
    activeMembers?: number[];
    activeSubgroups?: number[];
    className?: string;
};

const SearchList: React.FC<ListProps> = ({allUsers, subgroups, members, onMemberClick, onSubgroupClick, activeMembers, activeSubgroups, getFilteredMembers, className}) => {
    const users = useUsers()
    const [inputValue, setInputValue] = useState('')
    const [filteredMembers, setFilteredMembers] = useState<UserData[]>()
    const [filteredSubgroups, setFilteredSubgroups] = useState<RecGroupsData[] | undefined>(subgroups)

    const subgroupSearch = () => {
        if (subgroups !== undefined) {
            setFilteredSubgroups(subgroups.filter((subgroup) => {
                return subgroup.name.toLowerCase().includes(inputValue.toLowerCase());
            }));
        }
    };

    const memberSearch = () => {
        console.log('ttt', members, allUsers)
        if (members !== undefined) {
          setFilteredMembers(
            members.filter((member) => {
              const firstNameMatch = member.firstName.toLowerCase().includes(inputValue.toLowerCase());
              const lastNameMatch = member.lastName.toLowerCase().includes(inputValue.toLowerCase());
              return firstNameMatch || lastNameMatch;
            })
          );
        }
    };

    React.useEffect(() => {
        console.log('rerender', members, allUsers)
        if (getFilteredMembers)
        console.log('rerender getter is', getFilteredMembers())
        if (subgroups && inputValue !== undefined) {
            subgroupSearch()
        }

        if (members && inputValue !== undefined) {
            memberSearch()
        }
    }, [inputValue])

    return (
        <div className={cn(styles.list, className)}>
            <Form.Control type="text" placeholder="Поиск*" value={inputValue} onChange={(event: ChangeEvent<HTMLInputElement>) => setInputValue(event.target.value)} style={{ width: '100%', position: 'sticky', top: 0, zIndex: 1}} />
            { !allUsers ?
                <ul className={styles.list__options}>
                {filteredSubgroups
                ? filteredSubgroups.map((subgroup) => (
                    <li
                        onClick={() => onSubgroupClick && onSubgroupClick(subgroup.id)}
                        className={activeSubgroups?.includes(subgroup.id) ? `${styles.list__option} ${styles['list__option-active']}` : styles.list__option}
                    >
                        {subgroup.name}
                    </li>
                    ))
                : subgroups?.map((subgroup) => (
                    <li
                        onClick={() => onSubgroupClick && onSubgroupClick(subgroup.id)}
                        className={activeSubgroups?.includes(subgroup.id) ? `${styles.list__option} ${styles['list__option-active']}` : styles.list__option}
                    >
                        {subgroup.name}
                    </li>
                    ))}

                {filteredMembers
                ? filteredMembers.map((member) => (
                    <li
                        onClick={() => onMemberClick && onMemberClick(member.id)}
                        className={activeMembers?.includes(member.id) ? `${styles.list__option} ${styles['list__option-active']}` : styles.list__option}
                    >
                        {`${member.firstName} ${member.lastName}`}
                    </li>
                    ))
                : members?.map((member) => (
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
    )
}

export default SearchList