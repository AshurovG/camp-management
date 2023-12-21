import React from 'react'
import cn from 'classnames';
import styles from './ColorPalette.module.scss'
import { ColorData } from '../../../types'

export type ColorsProps = {
    colors: ColorData[];
    className?: string;
};

const ColorPalette: React.FC<ColorsProps> = ({colors, className}) => {
  return (
    <div className={cn(styles.colors, className)}>
        <div className={styles.colors__wrapper}>
        {
            colors.map((color: ColorData) => (
                <div className={styles.colors__item} style={{backgroundColor: color.value}}></div>
            ))
        }
        </div>
    </div>
  )
}

export default ColorPalette