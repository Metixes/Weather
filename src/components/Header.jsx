import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../data/store'
import { Select } from 'antd'
import { GlobalOutlined } from '@ant-design/icons'
import Icon from '../../public/favicon/android-chrome-192x192.png'
import i18n from '../i18next/i18next'

// STYLES
import '../assets/style/header/_header.scss'

export default function Header() {
    const navigate = useNavigate()
    const currentLanguage = localStorage.getItem('i18nextLng')
    const getWeathers = useStore(state => state.getWeathers)
    const cardsIsEmpty = useStore(state => state.cardsIsEmpty)

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

    const changeLang = (lang) => {
        i18n.changeLanguage(lang)
        navigate(`/${lang}`)
        getWeathers(lang)
        cardsIsEmpty(lang)
    }
    return(
        <div className='header'>
            <div className='header_wrapper'>
                <img className='header_icon' src={Icon} alt="weather-icon" />
                <div>
                    <GlobalOutlined />
                    <Select
                        bordered={false}
                        id='select'
                        defaultValue={currentLanguage}
                        options={languages}
                        onChange={(e) => changeLang(e)}
                    />
                </div>
            </div>
        </div>
    )
}