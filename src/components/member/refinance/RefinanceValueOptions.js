import React, { Component } from 'react'
import { Row, Col, Panel, Alert } from 'react-bootstrap';

export default class RefinanceValueOptions extends Component {

  handleValueOnChange(e) {
    const value = e.target.value
    console.log(value)
    this.props.onEnterUserFinanceValue(value)
  }

  handleOnClickUserValue() {
    console.log("user radio clicked")
    this.props.onClickUserRefinanceValue()
  }

  render() {
    const { refinanceValue,
            valueList,
            userInputRefinanceValue,
            onClickRefinanceValue,
            onClickUserRefinanceValue,
            onEnterUserFinanceValue } = this.props;

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
          <Col key='refinanceValueInput' md={ 8 } mdOffset={ 1 }>
            <div class="input-group">
              <span class="input-group-addon">
                <input checked={userInputRefinanceValue.selected} type="radio" name="refinanceValue" onChange={this.handleOnClickUserValue.bind(this)}/>
              </span>

              <span class="input-group-addon">Other: $</span>

              <input type="text" placeholder="enter a refinance value" value={onEnterUserFinanceValue} class="form-control text-right" onEnter={this.handleValueOnChange.bind(this)} />
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