import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, AutoComplete  } from 'antd'
import { useStore } from '../data/store'
import { useTranslation } from 'react-i18next';

import i18n from '../i18next/i18next'
import useDebounce from '../data/useDebounce'
import axios from 'axios'

import '../assets/style/main/_main.scss'

export default function Main() {
    const { t } = useTranslation();

    const navigate = useNavigate()
    const getWeather = useStore(state => state.getWeather)
    const getLatLonWeather = useStore(state => state.getLatLonWeather)
    const lenaguage = i18n.language

    const [inputCityName, setInputCityName] = useState('')
    const [citysList, setcitysList] = useState([])

    const debounceInputValue = useDebounce(inputCityName, 500)

    useEffect(() => {
        handelShowCurrentWeather(debounceInputValue)
    }, [debounceInputValue])

    useEffect(() => {
        getLatLonWeather(lenaguage)
        navigate(`/${i18n.language}`)
    }, [])

    const handelShowCurrentWeather = async (value) => {
        if(value === '') 
        return

        const options = {
            method: 'GET',
            baseURL: `https://api.api-ninjas.com/v1/city?`,
            params: {
                name: value,
                limit: 5
            },
            headers: {
                'X-Api-Key': '49l1hoU5qWpNBF+GahICKg==8kcYVF5gRNsB2H57'
            }
        }
        try{
            const { data } = await axios.request(options)
            if(data){
                const arrOptions = []
                data.forEach(el => arrOptions.push({ value: el.name, key: crypto.randomUUID() }))
                return setcitysList(arrOptions)
            }
        }catch{
            console.log('error')
        }
    }

    return(
        <div className='main'>
            <div className='main_search'>
                <AutoComplete className='main_search-input'
                    options={citysList}
                    value={inputCityName}
                    onSelect={(text) => getWeather(text, lenaguage)}
                    onChange={(text) => setInputCityName(text)}
                    placeholder={t("search-placeholder")}
                    onKeyDown={(e) => e.code === 'Enter' ? getWeather(inputCityName, lenaguage): ''}
                />
                <Button 
                    className='main_search-btn'
                    onClick={() => getWeather(inputCityName, lenaguage)}>
                    {t("search-button")}
                </Button>
            </div>
        </div>
    )
}