import * as React from 'react';
import cn from 'classnames';
import Text from '../Text/Text';
import styles from './Button.module.scss'


export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    className?: string;
};

const Button: React.FC<ButtonProps> = ({
    className,
    children,
    ...props
}) => {

    return (
        <button
            {...props}
            className={cn(styles.button, props.disabled && styles.button_disabled, className)}
            disabled={props.disabled}
        >
            <Text className={styles.button__text} tag='span' view='button'>
                {children}
            </Text>

        </button>
    )
};

export default Button;