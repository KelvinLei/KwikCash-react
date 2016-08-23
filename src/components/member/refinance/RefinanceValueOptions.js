import React from 'react'
import { Row, Col, Panel, Alert } from 'react-bootstrap';

export const RefinanceValueOptions = ({
  refinanceState,
  valueList,
  currentBalance,
  shouldDisplayAlert,
  onClickRefinanceValue,
  onClickUserRefinanceValue,
  onEnterUserFinanceValue
}) => {
  const handleValueOnChange = (e) => {
    onEnterUserFinanceValue(e.target.value)
  }

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

  const alertMessage = `Please select or enter a value that is higher than current balance: $${currentBalance}`

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
                <input checked={userInputRadioChecked} type="radio" name="refinanceValue" onChange={onClickUserRefinanceValue}/>
              </span>

            <span class="input-group-addon">Other: $</span>

            <input type="text"
                   placeholder="enter a refinance value"
                   value={refinanceValue} class="form-control text-right"
                   onChange={handleValueOnChange}
            />
            <span class="input-group-addon">.00</span>
          </div>
        </Col>
      </Row>

      {
        shouldDisplayAlert &&
        <Alert id="refinanceValueAlert" bsStyle="warning">
          <em className="fa fa-exclamation-circle fa-lg fa-fw"/>{alertMessage}
        </Alert>
      }
    </Panel>
  )
}

const RefinanceValueRadioButton = ({
  refinanceValue, value, userInputRadioChecked, onClickRefinanceValue
}) => {
  // if user input radio is checked, it takes precedence. Thus no other radio options should be checked
  const isChecked = !userInputRadioChecked && refinanceValue === value ? 'true' : ''

  return (
    <Col md={ 3 } mdOffset={ 2 } >
      <div class="radio">
        <label>
          <input checked={isChecked}
                 type="radio"
                 name="refinanceValue"
                 onChange={onClickRefinanceValue.bind(this, value)}
          />
          ${value}
        </label>
      </div>
    </Col>
  )
}