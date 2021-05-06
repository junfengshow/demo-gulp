import React from 'react'
import ReactDOM from 'react-dom'

class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      age: 1
    }
  }
  getName () {

    return this.name;
  }
  onClick = () => {
    this.setState({
      age: this.state.age + 1
    })
  }
  render () {
    const { age } = this.state
    return (
      <div>
        <a onClick={this.onClick}>click112233</a>
        <div>{age}</div>
      </div>
    )
  }
}

ReactDOM.render(<Main />, document.getElementById('app'))
