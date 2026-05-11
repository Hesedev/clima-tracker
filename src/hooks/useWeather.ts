import axios from "axios";
// import { object, string, number, type InferOutput, parse } from 'valibot';
import { z } from 'zod';
import type { SearchType } from "../types";
import { useMemo, useState } from "react";

// ZOD
const WeatherSchema = z.object({
    name: z.string(),
    main: z.object({
        temp: z.number(),
        temp_max: z.number(),
        temp_min: z.number()
    })
});
export type WeatherType = z.infer<typeof WeatherSchema>;

const initialState: WeatherType = {
    name: '',
    main: {
        temp: 0,
        temp_max: 0,
        temp_min: 0
    }
}

// VALIBOT
/* const WeatherSchema = object({
    name: string(),
    main: object({
        temp: number(),
        temp_max: number(),
        temp_min: number()
    })
});
// type WeatherType = InferOutput<typeof WeatherSchema>; */

export default function useWheather() {
    const [weather, setWeather] = useState<WeatherType>(initialState);
    const [loading, setLoading] = useState<boolean>(false);
    const [notFound, setNotFound] = useState<boolean>(false);

    const fetchWeather = async (search: SearchType) => {
        const API_Key = import.meta.env.VITE_API_KEY;
        const { city, country } = search;
        setLoading(true);
        setWeather(initialState);
        setNotFound(false);

        try {
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&appid=${API_Key}`;
            const { data: geoData } = await axios(geoUrl);

            // Comprobar si exite la data
            if (!geoData[0]) {
                setNotFound(true);
                throw new Error('Data geográfica no encontrada.');
            }

            const { lat, lon } = geoData[0];
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_Key}`;

            // Utilizando Zod
            const { data: weatherData } = await axios<WeatherType>(weatherUrl);
            const result = WeatherSchema.safeParse(weatherData);
            if (result.success) {
                setWeather(result.data);
            } else {
                setNotFound(true);
                throw new Error('El resultado no es compatible con el tipo Weather definido.');
            }

            // Utilizando Valibot
            /* const { data: weatherData } = await axios<WeatherType>(weatherUrl);
            const result = parse(WeatherSchema, weatherData);
            if (result) {
                console.log(result.main.temp)
            } else {
                throw new Error('El resultado no es compatible con el tipo Weather definido.')
            } */

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const hasWeatherData = useMemo(() => weather.name, [weather]);

    return {
        weather,
        notFound,
        loading,
        hasWeatherData,
        fetchWeather,
    }
}