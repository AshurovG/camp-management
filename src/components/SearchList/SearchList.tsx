import React from 'react'
import cn from 'classnames';
import styles from './SearchList.module.scss'
import { Form } from 'react-bootstrap';
import { RecGroupsData, UserData} from '../../../types';

export type ListProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    members: UserData[] | undefined;
    subgroups: RecGroupsData[] | undefined;
    onMemberClick: () => void;
    onSubgroupClick: () => void;
    className?: string;
};

const SearchList: React.FC<ListProps> = ({subgroups, members, onMemberClick, onSubgroupClick, className}) => {
  return (
    <div className={cn(styles.list, className)}>
        <Form.Control type="text" placeholder="Введите текст" style={{ width: '100%' }} />
        <ul className={styles.list__options}>
            {subgroups?.map((subgroup) => (
                <li onClick={onSubgroupClick} className={styles.list__option}>{subgroup.name}</li>
            ))}

            {members?.map((member) => (
                <li onClick={onMemberClick} className={styles.list__option}>{`${member.firstName} ${member.lastName}`}</li>
            ))}
        </ul>
    </div>
  )
}

export default SearchList