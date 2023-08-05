import React from 'react'
import Header from '../components/Header'
import Main from '../components/Main'
import WeatherCard from '../components/WeatherCard'
import { useParams } from 'react-router-dom'

function MainContainer() {
  return (
    <>
      <Header />
      <Main />
      <WeatherCard />
    </>
  )
}

export default MainContainer
