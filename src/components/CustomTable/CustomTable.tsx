import React from 'react'
import cn from 'classnames';
import styles from './CustomTable.module.scss'
import Table from 'react-bootstrap/Table';
import Button from 'components/Button';
import { EventData } from '../../../types';

type ColumnData = {
  key: string;
  title: string;
}

export type TableData = {
  columns: ColumnData[];
  data: any[];
  children?: React.ReactNode;
  flag: 0 | 1 | 2 | 3;
  className?: string;
  handleUsersButtonCLick?: (event: EventData) => void;
  handleChangeButtonClick?: (event: EventData) => void;
  handleDeleteButtonClick?: () => void;
};

const CustomTable: React.FC<TableData> = ({columns, data, children, flag, 
  handleUsersButtonCLick, handleChangeButtonClick, handleDeleteButtonClick, className}) => {
  return (
    <>
      <div className={`${styles.table__container} ${className}`}>
      <Table>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column.title}</th>
              ))}
              {(handleUsersButtonCLick || handleChangeButtonClick || handleDeleteButtonClick) && <th></th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, columnIndex) => (
                  <td key={columnIndex}>{row[column.key]}</td>
                ))}
                <td className={styles.table__action}>
                  {handleUsersButtonCLick && <Button onClick={() => handleUsersButtonCLick?.(row)} className={styles['events__page-btn']}>Участники</Button>}
                  {handleChangeButtonClick &&<Button onClick={() => handleChangeButtonClick?.(row)} className={styles['events__page-btn']}>Изменить</Button>}
                  {handleDeleteButtonClick && <Button onClick={handleDeleteButtonClick} className={styles['events__page-btn']}>Удалить</Button>}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default CustomTable