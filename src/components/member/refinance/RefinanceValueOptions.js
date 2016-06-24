import React, { Component } from 'react'
import { Row, Col, Panel, Alert } from 'react-bootstrap';

export default class RefinanceValueOptions extends Component {

  handleValueOnChange(e) {
    const value = e.target.value
    this.props.onEnterUserFinanceValue(value)
  }

  handleOnClickUserValue() {
    this.props.onClickUserRefinanceValue()
  }

  render() {
    const { refinanceState,
            valueList,
            onClickRefinanceValue,
            onClickUserRefinanceValue,
            onEnterUserFinanceValue } = this.props;

    const userInputRadioChecked = refinanceState.userInputRefinanceValue.selected ? 'checked' : ''

    var refinanceValueOptions = valueList.map((value, id) => {
      return (
        <RefinanceValueRadioButton key={id}
                                   userInputRadioChecked={userInputRadioChecked}
                                   refinanceValue={refinanceState.refinanceValue}
                                   value={value}
                                   onClickRefinanceValue={onClickRefinanceValue}
        />
      )
    })

    const refinanceValue = refinanceState.userInputRefinanceValue.value
    
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
                <input checked={userInputRadioChecked} type="radio" name="refinanceValue" onChange={this.handleOnClickUserValue.bind(this)}/>
              </span>

              <span class="input-group-addon">Other: $</span>

              <input type="text" placeholder="enter a refinance value" value={refinanceValue} class="form-control text-right" onChange={this.handleValueOnChange.bind(this)} />
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
    const { refinanceValue, value, userInputRadioChecked, onClickRefinanceValue} = this.props

    // if user input radio is checked, it takes precedence. Thus no other radio options should be checked
    const isChecked = !userInputRadioChecked && refinanceValue === value ? 'true' : ''

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