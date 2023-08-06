import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, AutoComplete } from 'antd'
import { useStore } from '../data/store'
import { useTranslation } from 'react-i18next'

import i18n from '../i18next/i18next'
import useDebounce from '../utility/useDebounce'
import instance from '../config'

import styles from '../assets/style/main/main.module.scss'

export default function Main() {
  const { t } = useTranslation()

  const navigate = useNavigate()
  const getWeather = useStore(state => state.getWeather)
  const getLatLonWeather = useStore(state => state.getLatLonWeather)

  const [inputCityName, setInputCityName] = useState('')
  const [citiesList, setCitiesList] = useState([])

  const debounceInputValue = useDebounce(inputCityName, 500)

  useEffect(() => {
    handelShowCurrentWeather(debounceInputValue)
  }, [debounceInputValue])

  useEffect(() => {
    getLatLonWeather(i18n.language)
  }, [])

  const handelShowWeather = (event, cityName, lng) => {
    if (event.code === 'Enter') getWeather(cityName, lng)
  }

  const handelShowCurrentWeather = async value => {
    if (value === '') return
    try {
      const { data } = await instance.ninjas.get('', {
        params: {
          name: value,
          limit: 5,
        }
      })
      if (data) {
        const arrOptions = []
        data.forEach(el => arrOptions.push({ value: el.name, key: crypto.randomUUID() }))
        return setCitiesList(arrOptions)
      }
    } catch {
      console.log('error')
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.main_search}>
        <AutoComplete
          className={styles.main_search_input}
          options={citiesList}
          value={inputCityName}
          onSelect={text => getWeather(text, i18n.language)}
          onChange={setInputCityName}
          placeholder={t('search-placeholder')}
          onKeyDown={e => handelShowWeather(e, inputCityName, i18n.language)}
        />
        <Button
          className={styles.main_search_btn}
          onClick={() => getWeather(inputCityName, i18n.language)}
        >
          {t('search-button')}
        </Button>
      </div>
    </div>
  )
}
