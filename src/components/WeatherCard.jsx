import { useStore } from '../data/store'
import { useTranslation } from 'react-i18next';
import i18n from '../i18next/i18next'
import { CloseOutlined } from '@ant-design/icons';
import { Area } from '@ant-design/plots';

import '../assets/style/main/_weather-card.scss'

export default function WeatherCard() {
    const { t } = useTranslation();
    const localeLng = i18n.language
    const card = useStore((state) => state.cards)
    const selectedFahrenheit = useStore((state) => state.selectedFahrenheit)
    const selectedCelsius = useStore((state) => state.selectedCelsius)
    const deleteWeatherCard = useStore((state) => state.deleteWeatherCard)

    const config = {
        xField: 'd',
        yField: 'temp',
        smooth: true,
        line: false,
        startOnZero: false,
        padding:[20, 0, 20, 0],
        label: {
            offset: 4,
            style: {
                fill: '#8d8d8d',
                fontSize: 6,
            },
        },
        yAxis: {
            label: false,
            grid: null,
            line: false,
            min: -50,
        },
        xAxis: {
            reversed: true,
            tickLine: false,
            line: false,
            label: {
                style: {
                    fill: '#8d8d8d',
                    fontSize: 8,
                },
            },
        },
    }

    return(
        <div className='main_weathers'>
            {
                Object.keys(card).map(el => (
                    <section key={crypto.randomUUID()} className={card[el].weatherCurrentTemp > 0 ? 'weather-card' : 'weather-card-is-cold'}>
                        <CloseOutlined className='weather-card_close-btn'
                            style={{width: 7}}
                            onClick={() => deleteWeatherCard(el)}
                        />
                        <div className='weather-card__city-info'>
                            <h1 className='weather-card_city-name'>{card[el].cityName}, {card[el].countryCode}</h1>
                            <div className='weather-card__description'>
                                <img className='weather-card_icon' src={`https://openweathermap.org/img/wn/${card[el].weatherIcon}@2x.png`} alt="weather-icon" />
                                <span className='weather-card_icon-description'>{card[el].weatherDescription}</span>
                            </div>
                        </div>
                        <span className='weather-card_data'>{card[el].cityDate}</span>
                        <div className='weather-card_charts'>
                            <Area
                                {...config}
                                data={card[el].formattedNextData}
                                color={card[el].weatherCurrentTemp > 0 ? 'l(270) 0:#FFF4F4 1:#FFA25B' : 'l(270) 0:#dcdfff 1:#459de9'}
                            />
                        </div>
                        <div className='weather-card__temp-info'>
                            <div className='weather-card__current-temp'>
                                <div className='weather-card__city-current-temp'>
                                    <div className='weather-card_city-temp'>
                                        {card[el].weatherCurrentTemp > 0 ? '+' + card[el].weatherCurrentTemp : card[el].weatherCurrentTemp}
                                    </div>
                                    <div className='weather-card__selected-units'>
                                        <button className={card[el].disabledFahrenheit 
                                            ? 
                                            'weather-card_selected-btn-active' 
                                            : 
                                            'weather-card_selected-btn'}
                                            disabled={card[el].disabledCelsius}
                                            onClick={() => selectedCelsius(el, localeLng)}
                                        >°C
                                        </button>
                                        <span className='weather-card_slash'></span>
                                        <button className={card[el].disabledFahrenheit 
                                            ? 
                                            'weather-card_selected-btn' 
                                            : 
                                            'weather-card_selected-btn-active'}
                                            disabled={card[el].disabledFahrenheit}
                                            onClick={() => selectedFahrenheit(el, localeLng)}   
                                        >°F
                                        </button>
                                    </div>
                                </div>
                                <span className='weather-card_feels-like'>
                                    {t("feels_like")}
                                    {card[el].weatherFeelsLike > 0 ? ' +' + card[el].weatherFeelsLike : card[el].weatherFeelsLike}
                                    {card[el].tempUnit}
                                </span>
                            </div>
                            <div className='weather-card__info'>
                                <p className='weather-card__info_items'>
                                    {t("wind")}:       
                                    <span className={card[el].weatherCurrentTemp > 0 
                                        ? 
                                        'weather-card__info_item-is-hot'
                                        :
                                        'weather-card__info_item-is-cold'}>
                                        {' ' + card[el].weatherWindSpeed} {t("wind-unit")}
                                    </span>
                                </p>
                                <p className='weather-card__info_items'>
                                    {t("humidity")}:
                                    <span className={card[el].weatherCurrentTemp > 0 
                                        ? 
                                        'weather-card__info_item-is-hot'
                                        :
                                        'weather-card__info_item-is-cold'}>
                                        {' ' + card[el].weatherHumidity} %
                                    </span>
                                </p>
                                <p className='weather-card__info_items'>
                                    {t("pressure")}:
                                    <span className={card[el].weatherCurrentTemp > 0 
                                        ? 
                                        'weather-card__info_item-is-hot'
                                        :
                                        'weather-card__info_item-is-cold'}>
                                        {' ' + card[el].weatherPressure} {t("pressure-utin")}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </section>
                ))
            }
        </div>
    )
}