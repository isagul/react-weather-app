import React, {useEffect, useState} from 'react';
import './App.scss';
import Downshift from 'downshift';
import TextField from '@material-ui/core/TextField';
import cityList from './assets/city.list.json';
import axios from 'axios';

const API_KEY = '890a44df0cf959052941cb2e3e122050'

function App() {
  const [cityWeather, setCityWeather] = useState({});
  let selectedCity = '';


  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    


    /*return () => {
      console.log('unmounting');
    }*/
  },[cityWeather]);

  function convertKelvinToCelcius(kelvin){
    return `${Math.round(kelvin - 273.15)} ${String.fromCharCode(176)}C`;    
  }
 
  return (
    <div className="App">
      <h1>Weather Extension</h1>
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
        <div className="weather-situation">
          <h2>Today</h2>
          <p>{convertKelvinToCelcius(cityWeather.main.temp)}</p>
          <p>{cityWeather.weather[0].main}</p>
          <p>{cityWeather.weather[0].description}</p>
        </div>
      }
    </div>
  );
}

export default App;
