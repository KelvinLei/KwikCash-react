import React, { Component } from 'react'
import { Button } from 'react-bootstrap';


export default class PayOffButton extends Component {
  render() {
    return (
      <div>
        <Button bsClass="btn btn-green" className="mb-sm">Payoff Loan</Button>
      </div>
    )
  }
}
