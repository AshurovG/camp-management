import React from 'react'
import cn from 'classnames';
import styles from './CustomTable.module.scss'
import Table from 'react-bootstrap/Table';

type ColumnData = {
  key: string;
  title: string;
}

export type TableData = {
  columns: ColumnData[];
  events: any[];
  children: React.ReactNode;
  className?: string;
};

const CustomTable: React.FC<TableData> = ({columns, events, children, className}) => {
  return (
    <>
      <div className={`${styles.table__container} ${className}`}>
      <Table>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column.title}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {events.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, columnIndex) => (
                  <td key={columnIndex}>{row[column.key]}</td>
                ))}
                <td className={styles.table__action}>{children}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default CustomTable