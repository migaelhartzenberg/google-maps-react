import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import GoogleMaps from './components/GoogleMaps/GoogleMaps'
import { GoogleMapsContextProvider } from './context/GoogleMapsContext'
import GoogleMapsWithContext from './components/GoogleMapsWithContext/GoogleMapsWithContext'

function App() {

  return (
    <div className='googleMap'>
     <GoogleMapsContextProvider apiKey={'AIzaSyDt3vKjfD3RWI6ucIKH0yYaw4mP5RJ_1fg'} libraries={['places']}>
        {/* <GoogleMaps /> */}
        <GoogleMapsWithContext />
        hello
     </GoogleMapsContextProvider>
    </div>
  )
}

export default App
