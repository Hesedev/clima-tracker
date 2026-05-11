import { } from 'react'
import styles from './App.module.css'
import Form from './components/Form/Form'
import useWheather from './hooks/useWeather';
import WeatherDetails from './components/WeatherDetails/WeatherDetails';
import Spinner from './components/Spinner/Spinner';
import Alert from './components/Alert/Alert';

function App() {
  const { weather, fetchWeather, hasWeatherData, loading, notFound } = useWheather();

  return (
    <>
      <h1 className={styles.title}>Clima{'🌤️'}<span>Tracker</span></h1 >

      <div className={styles.container}>
        <Form fetchWeather={fetchWeather} />
        {loading && <Spinner />}
        {hasWeatherData && !loading && <WeatherDetails weather={weather} />}
        {notFound && <Alert>Ciudad No Encontrada</Alert>}
      </div>
    </>
  )
}

export default App
