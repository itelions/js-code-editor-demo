import React, { Component } from 'react';
import './App.css';

import JsEditor from './components/js-editor'

class App extends Component {
  render() {
    return (
      <div className="App">
        <JsEditor></JsEditor>
      </div>
    );
  }
}

export default App;
