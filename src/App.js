import React from 'react';
import './App.scss';
import Downshift from 'downshift';
import TextField from '@material-ui/core/TextField';
import cityList from './assets/city.list.json';

let selectedCity = '';

function App() {
  console.log(cityList);
  return (
    <div className="App">
      <h1>Weather Extension</h1>
      <Downshift
        onChange={selection => {
          selectedCity = selection.name;
          console.log(selectedCity);
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
                {...getInputProps()} 
              />
              <ul {...getMenuProps()}>
                {isOpen
                  ? cityList.slice(0,10000)
                    .filter(item => !inputValue || item.name.toLowerCase().includes(inputValue.toLowerCase()))
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
    </div>
  );
}

export default App;
