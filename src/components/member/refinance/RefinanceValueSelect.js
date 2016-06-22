import React, { Component } from 'react'
import { Row, Col, Panel, Alert } from 'react-bootstrap';

export default class RefinanceValueSelect extends Component {

  render() {
    const { refinanceValue, valueList, onClickRefinanceValue } = this.props;

    var refinanceValueOptions = valueList.map((value, id) => {
      return (
        <RefinanceValueRadioButton key={id} refinanceValue={refinanceValue} value={value} onClickRefinanceValue={onClickRefinanceValue}/>
      )
    })

    return (
      <Panel header="Potential refinance value">
        <Alert bsStyle="info">
          Select or enter a value, and see your new balance on the right
        </Alert>

        { /* radio buttons for refinance value */ }
        {refinanceValueOptions}

        <Row>
          <Col md={ 8 } mdOffset={ 1 }>
            <div class="input-group">
              <span class="input-group-addon">
                <input type="radio" name="refinanceValue"/>
              </span>

              <span class="input-group-addon">Other: $</span>

              <input type="text" class="form-control text-right" aria-label="Amount (to the nearest dollar)"/>
              <span class="input-group-addon">.00</span>
            </div>
          </Col>
        </Row>
      </Panel>
    )
  }
}

class RefinanceValueRadioButton extends Component{

  handleOnClick(selectedValue) {
    this.props.onClickRefinanceValue(selectedValue)
  }

  render() {
    const { refinanceValue, value, onClickRefinanceValue} = this.props

    const isChecked = refinanceValue === value ? 'checked' : ''

    return (
      <Col md={ 3 } mdOffset={ 2 } >
        <div class="radio">
          <label>
            <input checked={isChecked} type="radio" name="refinanceValue" onChange={this.handleOnClick.bind(this, value)}/>
            ${value}
          </label>
        </div>
      </Col>
    )
  }
}