import React, {useState} from 'react';
import './App.scss';
import Downshift from 'downshift';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import deburr from 'lodash/deburr';
import cityList from './assets/city.list.json';
import axios from 'axios';

const API_KEY = '';

function App() {
  const [cityWeather, setCityWeather] = useState({});
  let selectedCity = '';

  function convertKelvinToCelcius(kelvin) {
    return `${Math.round(kelvin - 273.15)} ${String.fromCharCode(176)}C`;    
  }

  function convertUTCtoDate(utc){
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

  function renderInput(inputProps) {
      const { InputProps, classes, ref, ...other } = inputProps;
      return (
          <TextField
              autoFocus
              InputProps={{
                  inputRef: ref,
                  classes: {
                      root: classes.inputRoot,
                      input: classes.inputInput,
                  },
                  ...InputProps,
              }}
              {...other}
          />
      );
  }
    
  const useStyles = makeStyles(theme => ({
      root: {
          flexGrow: 1,
          height: 250,
      },
      container: {
          flexGrow: 1,
          position: 'relative',
          padding: '10px'
      },
      paper: {
          position: 'absolute',
          zIndex: 1,
          marginTop: theme.spacing(1),
          left: 0,
          right: 0,
      },
      chip: {
          margin: theme.spacing(0.5, 0.25),
      },
      inputRoot: {
          flexWrap: 'wrap',
      },
      inputInput: {
          width: 'auto',
          flexGrow: 1,
      },
      divider: {
          height: theme.spacing(2),
      },
    }));

    const classes = useStyles();

    function renderSuggestion(suggestionProps) {
      const { suggestion, index, itemProps, highlightedIndex, selectedItem } = suggestionProps;
      const isHighlighted = highlightedIndex === index;
      const isSelected = (selectedItem || '').indexOf(suggestion.name) > -1;

      return (
          <MenuItem
              {...itemProps}
              key={suggestion.id}
              selected={isHighlighted}
              component="div"
              style={{
                  fontWeight: isSelected ? 500 : 400,
              }}
          >
            {suggestion.name}
          </MenuItem>
      );
    }
    function getSuggestions(value, { showEmpty = false } = {}) {
      const inputValue = deburr(value.trim()).toLowerCase();
      const inputLength = inputValue.length;
      let count = 0;

      return inputLength === 0 && !showEmpty
          ? []
          : cityList.filter(suggestion => {
              const keep =
                  count < 5 && suggestion.name.slice(0, inputLength).toLowerCase() === inputValue;

              if (keep) {
                  count += 1;
              }

              return keep;
          });
    }

  return (
    <div className="App">
      <div className="app-title">
        <img src={require('./assets/weather-icon.png')} alt="weather-icon"/>
        <div>
          <h1>Weather Extension</h1>
          <p>Learn quickly weather of city where you live in.</p>            
        </div>        
      </div>
        <Downshift id="downshift-simple"
           onChange={selection => {
               selectedCity = selection;
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
                  getLabelProps,
                  getMenuProps,
                  highlightedIndex,
                  inputValue,
                  isOpen,
                  selectedItem,
              }) => {
                const { onBlur, onFocus, ...inputProps } = getInputProps({
                    placeholder: 'Search for a city name',
                });

                return (
                    <div className={classes.container}>
                        {renderInput({
                            fullWidth: true,
                            classes,
                            label: 'City Name',
                            InputLabelProps: getLabelProps({ shrink: true }),
                            InputProps: { onBlur, onFocus },
                            inputProps
                        })}

                        <div {...getMenuProps()}>
                            {isOpen ? (
                              <Paper className={classes.paper} square>
                                  {getSuggestions(inputValue).map((suggestion, index) =>
                                      renderSuggestion({
                                          suggestion,
                                          index,
                                          itemProps: getItemProps({ item: suggestion.name }),
                                          highlightedIndex,
                                          selectedItem,
                                      }),
                                  )}
                              </Paper>
                            ) : null}
                        </div>
                    </div>
                );
            }}
        </Downshift>
      {
        Object.keys(cityWeather).length > 0 &&
        <div className="weather-info">
          <h3 className='city-name'>{cityWeather.name}</h3>
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
