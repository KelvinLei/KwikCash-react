import React, { Component } from 'react'
import { Button } from 'react-bootstrap';


export default class PayOffButton extends Component {
  render() {
    return (
      <div>
        <Button bsSize="large" bsStyle="info" className="mb-sm">Payoff Loan</Button>
      </div>
    )
  }
}
