import React from 'react'
import ReactDOM from 'react-dom'

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
      <div>this is main</div>
    )
  }
}

ReactDOM.render(<Main />, document.getElementById('app'))
