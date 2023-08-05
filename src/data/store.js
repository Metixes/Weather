import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import dayjs from 'dayjs'
import instance from '../config'

const API_KEY = '5fedcbd7c2c4e234f857f50c88de30ae'

export const useStore = create()(
  persist(
    (set, get) => ({
      cards: {},
      currentUnits: '°C',

      cardsIsEmpty: obj => {
        return Object.keys(obj).length === 0
      },
      getLatLonWeather: lng => {
        if (get().cardsIsEmpty(get().cards) && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async position => {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            try {
              const res = await instance.get('forecast', {
                params: {
                  lat: latitude,
                  lon: longitude,
                  units: 'metric',
                  cnt: 40,
                  appid: API_KEY,
                  lang: lng,
                },
              })
              const data = res.data
              if (data) {
                const card = {
                  tempUnit: '°C',
                  disabledCelsius: true,
                  disabledFahrenheit: false,
                  cityName: data.city.name,
                  countryCode: data.city.country,
                  cityDate: dayjs(new Date())
                    .locale(lng)
                    .format(lng === 'uk' ? 'dd, MMMM YYYY, HH:mm' : 'ddd MMMM YYYY, HH:mm'),
                  weatherIcon: data.list[0].weather[0].icon,
                  weatherDescription: data.list[0].weather[0].description,
                  weatherCurrentTemp: data.list[0].main.temp.toFixed(),
                  weatherPressure: data.list[0].main.pressure,
                  nextData: data.list,
                  formattedNextData: get().getCurrentData(data.list),
                  weatherFeelsLike: data.list[0].main.feels_like.toFixed(),
                  weatherHumidity: data.list[0].main.humidity,
                  weatherWindSpeed: data.list[0].wind.speed,
                  cardId: data.city.id,
                }

                set(state => ({
                  cards: { ...state.cards, [data.city.id]: card },
                }))
              }
            } catch {
              console.error('error')
            }
            error => {
              console.error('Error getting geolocation:', error.message)
            }
          })
        } else {
          console.error('Geolocation is not supported by this browser.')
        }
      },
      getWeathers: async lng => {
        const cards = get().cards
        const citiesId = Object.keys(cards).join()

        try {
          const { data } = await instance.get('group', {
            params: {
              id: citiesId,
              lang: lng,
              units: 'metric',
              cnt: 40,
              appid: import.meta.env.VITE_API_KEY,
            },
          })
          if (data) {
            set(state => {
              const updatedCards = { ...state.cards }
              data.list.forEach(el => {
                updatedCards[el.id] = {
                  ...updatedCards[el.id],
                  weatherDescription: el.weather[0].description,
                  cityDate: dayjs(new Date())
                    .locale(lng)
                    .format(lng === 'uk' ? 'dd, MMMM YYYY, HH:mm' : 'ddd MMMM YYYY, HH:mm'),
                  formattedNextData:
                    lng === 'he'
                      ? get().getCurrentData(updatedCards[el.id].nextData).reverse() // reversed formattedDana if locale language is "he" for charts
                      : get().getCurrentData(updatedCards[el.id].nextData), // and give default formattedData if locale language is not "he" for charts
                }
              })
              return { cards: updatedCards }
            })
          }
        } catch {
          console.error('error')
        }
      },
      getWeather: async (cityValue, lng) => {
        if (Object.values(get().cards).find(el => el.cityName === cityValue)) return

        try {
          const res = await instance.get('forecast', {
            params: {
              q: `${cityValue}`,
              units: 'metric',
              cnt: 40,
              appid: API_KEY,
              lang: lng,
            },
          })
          const date = res.data
          if (date) {
            const card = {
              tempUnit: '°C',
              disabledCelsius: true,
              disabledFahrenheit: false,
              cityName: date.city.name,
              countryCode: date.city.country,
              cityDate: dayjs(new Date())
                .locale(lng)
                .format(lng === 'uk' ? 'dd MMMM YYYY, HH:mm' : 'ddd MMMM YYYY, HH:mm'),
              weatherIcon: date.list[0].weather[0].icon,
              weatherDescription: date.list[0].weather[0].description,
              weatherCurrentTemp: date.list[0].main.temp.toFixed(),
              weatherPressure: date.list[0].main.pressure,
              nextData: date.list,
              formattedNextData: get().getCurrentData(date.list),
              weatherFeelsLike: date.list[0].main.feels_like.toFixed(),
              weatherHumidity: date.list[0].main.humidity,
              weatherWindSpeed: date.list[0].wind.speed,
              cardId: date.city.id.toString(),
            }

            set(state => ({
              cards: { [date.city.id.toString()]: card, ...state.cards },
            }))
          }
        } catch {
          console.error(alert(`Such a city does not exist. Check that the input is correct`))
        }
      },
      getCurrentData: items => {
        if (items.length) {
          const result = []
          const uniqueDates = [...new Set(items.map(item => dayjs(item.dt_txt).format('DD.MM')))]

          for (const currentDate of uniqueDates) {
            const temps = items
              .filter(item => dayjs(item.dt_txt).format('DD.MM') === currentDate)
              .map(item => Number(item.main.temp))
            const averageTemp = temps.reduce((sum, temp) => sum + temp, 0) / temps.length
            result.push({ d: currentDate, temp: Number(averageTemp.toFixed()) })
          }

          return result
        }
      },
      selectedCelsius: cardId => {
        const cards = get().cards
        const currentCard = cards[cardId]
        const isCelsius = cards[cardId].disabledCelsius
        const isFahrenheit = cards[cardId].disabledFahrenheit

        if (currentCard) {
          function getCelsius(celsius) {
            return Number((((celsius - 32) * 5) / 9).toFixed())
          }

          const tempInCelsius = currentCard.formattedNextData.map(celsius => {
            return { d: celsius.d, temp: getCelsius(celsius.temp) }
          })

          const currentTempInCelsius = getCelsius(currentCard.weatherCurrentTemp)
          const feelsLikeTempInCelsius = getCelsius(currentCard.weatherFeelsLike)

          set(state => ({
            cards: {
              ...state.cards,
              [cardId]: {
                ...currentCard,
                disabledCelsius: !isCelsius,
                disabledFahrenheit: !isFahrenheit,
                tempUnit: ' °C',
                formattedNextData: tempInCelsius,
                weatherCurrentTemp: currentTempInCelsius,
                weatherFeelsLike: feelsLikeTempInCelsius,
              },
            },
          }))
        }
      },
      selectedFahrenheit: cardId => {
        const cards = get().cards
        const currentCard = cards[cardId]
        const isCelsius = cards[cardId].disabledCelsius
        const isFahrenheit = cards[cardId].disabledFahrenheit

        if (currentCard) {
          function getFahrenheit(fahrenheit) {
            return Number(((fahrenheit * 9) / 5 + 32).toFixed())
          }

          const tempInFahrenheit = currentCard.formattedNextData.map(fahrenheit => {
            return { d: fahrenheit.d, temp: getFahrenheit(fahrenheit.temp) }
          })

          const currentTempInFahrenheit = getFahrenheit(currentCard.weatherCurrentTemp)
          const feelsLikeTempInFahrenheit = getFahrenheit(currentCard.weatherFeelsLike)

          set(state => ({
            cards: {
              ...state.cards,
              [cardId]: {
                ...currentCard,
                disabledCelsius: !isCelsius,
                disabledFahrenheit: !isFahrenheit,
                tempUnit: ' °F',
                formattedNextData: tempInFahrenheit,
                weatherCurrentTemp: currentTempInFahrenheit,
                weatherFeelsLike: feelsLikeTempInFahrenheit,
              },
            },
          }))
        }
      },
      deleteWeatherCard: cardId => {
        set(state => {
          const cards = { ...state.cards }
          delete cards[cardId]
          return { cards }
        })
      },
    }),
    {
      name: 'weather-cards',
      getStorage: () => localStorage,
    }
  )
)
