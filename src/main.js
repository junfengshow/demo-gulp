import React from 'react'
import ReactDOM from 'react-dom'
import { Button } from './components'

class Main extends React.Component {
  constructor (props) {
    super(props)
    this.name = 'name'
  }
  getName () {

    return this.name;
  }
  render () {
    return (
      <div>
        <Button />
      </div>
    )
  }
}

ReactDOM.render(<Main />, document.getElementById('app'))
