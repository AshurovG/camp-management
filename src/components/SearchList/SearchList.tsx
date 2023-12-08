import React, { useState, ChangeEvent, MouseEventHandler} from 'react'
import cn from 'classnames';
import styles from './SearchList.module.scss'
import { Form } from 'react-bootstrap';
import { RecGroupsData, UserData} from '../../../types';

export type ListProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    members: UserData[] | undefined;
    subgroups: RecGroupsData[] | undefined;
    onMemberClick: (id: number) => void;
    onSubgroupClick: (id: number) => void;
    activeMembers: number[];
    activeSubgroups: number[];
    className?: string;
};

const SearchList: React.FC<ListProps> = ({subgroups, members, onMemberClick, onSubgroupClick, activeMembers, activeSubgroups, className}) => {
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
        subgroupSearch()
        memberSearch();
    }, [inputValue])

    return (
        <div className={cn(styles.list, className)}>
            <Form.Control type="text" placeholder="Введите текст" value={inputValue} onChange={(event: ChangeEvent<HTMLInputElement>) => setInputValue(event.target.value)} style={{ width: '100%', position: 'sticky', top: 0, zIndex: 1}} />
            <ul className={styles.list__options}>
            {filteredSubgroups
            ? filteredSubgroups.map((subgroup) => (
                <li
                    onClick={() => onSubgroupClick(subgroup.id)}
                    className={activeSubgroups.includes(subgroup.id) ? `${styles.list__option} ${styles['list__option-active']}` : styles.list__option}
                >
                    {subgroup.name}
                </li>
                ))
            : subgroups?.map((subgroup) => (
                <li
                    onClick={() => onSubgroupClick(subgroup.id)}
                    className={activeSubgroups.includes(subgroup.id) ? `${styles.list__option} ${styles['list__option-active']}` : styles.list__option}
                >
                    {subgroup.name}
                </li>
                ))}

            {filteredMembers
            ? filteredMembers.map((member) => (
                <li
                    onClick={() => onMemberClick(member.id)}
                    className={activeMembers.includes(member.id) ? `${styles.list__option} ${styles['list__option-active']}` : styles.list__option}
                >
                    {`${member.firstName} ${member.lastName}`}
                </li>
                ))
            : members?.map((member) => (
                <li
                    onClick={() => onMemberClick(member.id)}
                    className={activeMembers.includes(member.id) ? `${styles.list__option} ${styles['list__option-active']}` : styles.list__option}
                >
                    {`${member.firstName} ${member.lastName}`}
                </li>
                ))}
            </ul>
        </div>
    )
}

export default SearchList