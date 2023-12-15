import React, {useState, ChangeEvent} from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';
import styles from './LoginPage.module.scss'
import {Form} from 'react-bootstrap'
import Button from 'components/Button'

const LoginPage = () => {
    const [passwordValue, setPasswordValue] = useState('')

    const login = async () => {
        try {
            const response = await axios(`https://specializedcampbeta.roxmiv.com/api/login`, {
                method: 'POST',
                data: {code: passwordValue}
            })
            toast.success('Вы успешно вошли в систему!')
        } catch {
            toast.error('Неверный код!')
        } finally {
            // getUserInfo()
        }
    }

    const getUserInfo = async () => {
        try {
          const response = await axios(`https://specializedcampbeta.roxmiv.com/api/self`, {
            method: 'GET',
            withCredentials: true
          })
        } catch {
          
        }
    }
    

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        login()
    }

    return (
        <div className={styles.login__page}>
            <div className={styles['login__page-wrapper']}>
                <div className={styles['login__page-content']}>
                    <h1 className={styles['login__page-title']}>Необходимо войти в систему</h1>
                    <h4 className={styles['login__page-subtitle']}>Введите шестизначный код</h4>
                    <Form onSubmit={(event: React.FormEvent<HTMLFormElement>) => handleFormSubmit(event)}
                    className={styles['form']}>
                        <div className={styles.form__item}>
                            <Form.Control onChange={(event: ChangeEvent<HTMLInputElement>) => setPasswordValue(event.target.value)} value={passwordValue} className={styles.form__input} type="password" placeholder="Код*" />
                        </div>
                        <Button disabled={passwordValue.length !== 6} type='submit'>Войти</Button>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default LoginPage