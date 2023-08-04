import { useStore } from '../data/store'
import { useTranslation } from 'react-i18next';
import { CloseOutlined } from '@ant-design/icons';
import { Area } from '@ant-design/plots';

import i18n from '../i18next/i18next'
import cn from 'classnames';

import styles from '../assets/style/main/weatherCard.module.scss'

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

export default function WeatherCard() {
    const { t } = useTranslation();
    const card = useStore((state) => state.cards)
    const selectedFahrenheit = useStore((state) => state.selectedFahrenheit)
    const selectedCelsius = useStore((state) => state.selectedCelsius)
    const deleteWeatherCard = useStore((state) => state.deleteWeatherCard)

    return(
        <div className={styles.weather}>
            {card && (
                Object.keys(card).map(el => (
                    <section key={el} className={cn(styles.weather_card, {[styles.weather_card_isCold] : card[el].weatherCurrentTemp < 0})}>
                        <CloseOutlined className={styles.weather_card_closeBtn}
                            onClick={() => deleteWeatherCard(el)}
                        /> 
                        <div className={styles.weather_card__cityInfo}>
                            <h1 className={styles.weather_card_cityName}>{card[el].cityName}, {card[el].countryCode}</h1>
                            <div className={styles.weather_card__description}>
                                <img className={styles.weather_card_icon} src={`https://openweathermap.org/img/wn/${card[el].weatherIcon}@2x.png`} alt="weather-icon" />
                                <span className={styles.weather_card_iconDescription}>{card[el].weatherDescription}</span>
                            </div>
                        </div>
                        <span className={styles.weather_card_data}>{card[el].cityDate}</span>
                        <div className={styles.weather_card_charts}>
                            <Area
                                {...config}
                                data={card[el].formattedNextData}
                                color={card[el].weatherCurrentTemp > 0 ? 'l(270) 0:#FFF4F4 1:#FFA25B' : 'l(270) 0:#dcdfff 1:#459de9'}
                            />
                        </div>
                        <div className={styles.weather_card__tempInfo}>
                            <div className={styles.weather_card__currentTemp}>
                                <div className={styles.weather_card__cityCurrentTemp}>
                                    <div className={styles.weather_card_cityTemp}>
                                        {card[el].weatherCurrentTemp > 0 ? '+' + card[el].weatherCurrentTemp : card[el].weatherCurrentTemp}
                                    </div>
                                    <div className={styles.weather_card__selectedUnits}>
                                        <button className={cn(styles.weather_card_selectedBtn, {[styles.weather_card_selectedBtnActive] : card[el].disabledFahrenheit})}
                                            disabled={card[el].disabledCelsius}
                                            onClick={() => selectedCelsius(el, i18n.language)}
                                        >°C
                                        </button>
                                        <span className={styles.weather_card_slash}></span>
                                        <button className={cn(styles.weather_card_selectedBtn, {[styles.weather_card_selectedBtnActive] : card[el].disabledCelsius})}
                                            disabled={card[el].disabledFahrenheit}
                                            onClick={() => selectedFahrenheit(el, i18n.language)}   
                                        >°F
                                        </button>
                                    </div>
                                </div>
                                <span className={styles.weather_card_feelsLike}>
                                    {t("feels_like")}
                                    {card[el].weatherFeelsLike > 0 ? ' +' + card[el].weatherFeelsLike : card[el].weatherFeelsLike}
                                    {card[el].tempUnit}
                                </span>
                            </div>
                            <div className={styles.weather_card__info}>
                                <p className={styles.weather_card__info_items}>
                                    {t("wind")}:       
                                    <span className={cn(styles.weather_card__info_itemIsHot, {[styles.weather_card__info_itemIsCold]: card[el].weatherCurrentTemp < 0})}>
                                        {' ' + card[el].weatherWindSpeed} {t("wind-unit")}
                                    </span>
                                </p>
                                <p className='weather-card__info_items'>
                                    {t("humidity")}:
                                    <span className={cn(styles.weather_card__info_itemIsHot, {[styles.weather_card__info_itemIsCold]: card[el].weatherCurrentTemp < 0})}>
                                        {' ' + card[el].weatherHumidity} %
                                    </span>
                                </p>
                                <p className='weather-card__info_items'>
                                    {t("pressure")}:
                                    <span className={cn(styles.weather_card__info_itemIsHot, {[styles.weather_card__info_itemIsCold]: card[el].weatherCurrentTemp < 0})}>
                                        {' ' + card[el].weatherPressure} {t("pressure-unit")}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </section>
                ))
            )   
            }
        </div>
    )
}