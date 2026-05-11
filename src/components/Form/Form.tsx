import { useState, type ChangeEvent, type SubmitEvent } from 'react'
import { countries } from '../../data/countries'
import styles from './Form.module.css'
import type { SearchType } from '../../types';
import Alert from '../Alert/Alert';

type FormProps = {
    fetchWeather: (search: SearchType) => Promise<void>
}

export default function Form({ fetchWeather }: FormProps) {
    const [search, setSearch] = useState<SearchType>({
        city: '',
        country: ''
    });
    const [alert, setAlert] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { value, name } = e.target;

        setSearch({
            ...search,
            [name]: value
        });
    }

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (Object.values(search).includes('')) {
            setAlert('Todos los campos son obligatorios.');
            return;
        }

        await fetchWeather(search);
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {alert && (
                <Alert>{alert}</Alert>
            )}
            <div className={styles.field}>
                <label htmlFor='city'>Ciudad: </label>
                <input
                    id='city'
                    name='city'
                    type='text'
                    placeholder='Ciudad'
                    value={search.city}
                    onChange={handleChange}
                />
            </div>
            <div className={styles.field}>
                <label htmlFor='country'>País: </label>
                <select id='country' name='country' value={search.country} onChange={handleChange}>
                    <option value=''>-- Seleccione un País --</option>
                    {countries.map(country => (
                        <option key={country.code} value={country.name}>
                            {country.name}
                        </option>
                    ))}
                </select>
            </div>

            <input
                id='consultarClima'
                type='submit'
                className={styles.submit}
                value='Consultar Clima'
            />
        </form>
    )
}
