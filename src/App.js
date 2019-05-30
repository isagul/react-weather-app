import React, {useState} from 'react';
import './App.scss';
import Downshift from 'downshift';
import TextField from '@material-ui/core/TextField';
import cityList from './assets/city.list.json';
import axios from 'axios';

const API_KEY = '890a44df0cf959052941cb2e3e122050'

function App() {
  const [cityWeather, setCityWeather] = useState({});
  let selectedCity = '';

  const convertKelvinToCelcius = kelvin => {
    return `${Math.round(kelvin - 273.15)} ${String.fromCharCode(176)}C`;    
  }

  const convertUTCtoDate = utc => {
    let date = new Date(utc * 1000);
    let hour = '';
    let minutes = '';
    if (String(date.getHours()).length === 1) {
      hour = `0${date.getHours()}`;
    } else {
      hour = `${date.getHours()}`;
    }
    if (String(date.getMinutes()).length === 1) {
      minutes = `${date.getMinutes()}0`;
    } else {
      minutes = `${date.getMinutes()}`;
    }
    return `${hour}:${minutes}`;
  }
 
  return (
    <div className="App">
      <div className="app-title">
        <img src={require('./assets/weather-icon.png')} alt="weather-icon"/>
        <h1>Weather Extension</h1>
      </div>      
      <Downshift
        onChange={selection => {
          selectedCity = selection.name
          axios.get('http://api.openweathermap.org/data/2.5/weather', {
          params: {
            q: selectedCity,
            APPID: API_KEY
          }      
        })
        .then(function (response) {
          setCityWeather(response.data);
        })
        .catch(function (error) {
          console.log(error);
        })
        
        }}
        itemToString={item => (item ? item.name : '')}
      >
        {({
          getInputProps,
          getItemProps,
          getMenuProps,
          isOpen,
          inputValue,
          selectedItem,
        }) => (
            <div>      
              <TextField
                id="standard-name"
                label="City"
                margin="normal"
                placeholder="Min 3 characters"
                {...getInputProps()} 
              />
              <ul {...getMenuProps()}>
                {isOpen
                  ? cityList
                    .filter(item => {
                      return inputValue.length > 2 && item.name.toLowerCase().includes(inputValue.toLowerCase())
                    })
                    .map((item, index) => (
                      <li
                        {...getItemProps({
                          key: item.id,
                          index,
                          item,
                          style: {
                            fontWeight: selectedItem === item ? 'bold' : 'normal',
                          },
                        })}
                      >
                      {item.name}
                      </li>
                    ))
                  : null}
              </ul>
            </div>
          )}
      </Downshift>
      {
        Object.keys(cityWeather).length > 0 &&
        <div className="weather-info">
          <div className="weather-main">
            <div>
              <span>Longitude</span> 
              <p>{cityWeather.coord.lon}</p>
            </div>
            <div>
              <span>Latitude</span>
              <p>{cityWeather.coord.lat}</p>
            </div>
            <div>
              <span>Sunrise</span>
              <p>{convertUTCtoDate(cityWeather.sys.sunrise)}</p>
            </div>
            <div>
              <span>Sunset</span> 
              <p>{convertUTCtoDate(cityWeather.sys.sunset)}</p>
            </div>        
          </div>

          <div className="weather-situation">
            <img 
            src={`http://openweathermap.org/img/w/${cityWeather.weather[0].icon}.png`} 
            alt="weather-icon" 
            title={cityWeather.weather[0].description}/>
            <p className="weather-temperature">{convertKelvinToCelcius(cityWeather.main.temp)}</p>
            <p>{cityWeather.weather[0].main}</p>
            <div>
              <span>Pressure</span>
              <p>{cityWeather.main.pressure}hPa</p>
            </div>
            <div>
              <span>Humidity</span>
              <p>{cityWeather.main.humidity}%</p> 
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default App;
