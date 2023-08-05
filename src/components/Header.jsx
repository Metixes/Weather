import { useNavigate } from 'react-router-dom'
import { useStore } from '../data/store'
import { Select } from 'antd'
import { GlobalOutlined } from '@ant-design/icons'

import Icon from '../../public/favicon/android-chrome-192x192.png'
import i18n from '../i18next/i18next'

// STYLES
import styles from '../assets/style/header/header.module.scss'

const languages = [
  {
    value: 'en',
    label: 'EN',
  },
  {
    value: 'uk',
    label: 'UK',
  },
  {
    value: 'he',
    label: 'HE',
  },
]

export default function Header() {
  const navigate = useNavigate()
  const currentLanguage = localStorage.getItem('i18nextLng')
  const getWeathers = useStore(state => state.getWeathers)
  const cardsIsEmpty = useStore(state => state.cardsIsEmpty)

  const changeLang = lang => {
    i18n.changeLanguage(lang)
<<<<<<< HEAD
    navigate(`/${lang}/`)
=======
    navigate(`/${lang}`)
>>>>>>> 83bb1cc59c3434c544d63dbd890e7b43dfd5b559
    getWeathers(lang)
    cardsIsEmpty(lang)
  }
  return (
    <div className={styles.header}>
      <div className={styles.header_wrapper}>
        <img className={styles.header_icon} src={Icon} alt="weather-icon" />
        <div className={styles.header__language}>
          <GlobalOutlined className={styles.header__language_icon} />
          <Select
            className={styles.header__language_select}
            bordered={false}
            id="select"
            defaultValue={currentLanguage}
            options={languages}
            onChange={changeLang}
          />
        </div>
      </div>
    </div>
  )
}
