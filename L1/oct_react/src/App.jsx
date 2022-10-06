import logo from './logo.svg';
import './App.css';
import HelloClass from './HelloClass'
import ClassComponent from './ClassComponent';
import { useState } from 'react';

function App() {

  const [classComponent, setClassComponent] = useState(true)

  const hideClassComponent = () => {
    setClassComponent(!classComponent)
  }

  return (
    <>
      <HelloClass />
      {classComponent && <ClassComponent statechange="props.stateChange" />}
      <button type='button' onClick={hideClassComponent}>Ẩn Class Component props</button>

    </>
  );
}

export default App;
