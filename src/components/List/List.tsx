import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import styles from './List.module.scss'
import Table from 'react-bootstrap/Table';
import Button from 'components/Button';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { EventData } from '../../../types';

export type SubscriptionsTableProps = {
  events: EventData[];
  className?: string;
};

const ApplicationsTable: React.FC<SubscriptionsTableProps> = ({events, className}) => {
  const [isModalWindowOpened, setIsModalWindowOpened] = useState(false);

  const handleDetailedButtonClick = (id: number) => {
    console.log('button was clicked', id)
  };

  return (
    <>
    <div className={styles.table__container}>
    <Table responsive borderless className={!className ? styles.table : cn(styles.table, className)}>
        <thead>
          <tr className={styles.tableHead}>
            <th>№</th>
            <th>Название</th>
            <th>Время начала</th>
            <th>Время окончания</th>
            <th>Место проведения</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {events.map((event: EventData, index: number) => (
            <tr key={event.id}>
              <td>{++index}</td>
              <td>{event.title}</td>
              <td>{event.timeStart}</td>
              <td>{event.timeEnd}</td>
              <td>{event.place}</td>
              <td className={styles.table__action}>
                <Button className={styles['table__action-btn']} onClick={() => handleDetailedButtonClick(event.id)}>Участники</Button>
                <Button className={styles['table__action-btn']} onClick={() => handleDetailedButtonClick(event.id)}>Изменить</Button>
                <Button className={styles['table__action-btn']} onClick={() => handleDetailedButtonClick(event.id)}>Удалить</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
    </>
  );
}

export default ApplicationsTable