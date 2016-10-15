import React from 'react'
import { Row, Col, Panel, Button } from 'react-bootstrap';

export const MembersFilter = ( {fetchMembers} ) => {

  const filterMembersOnClick = (e) => {
    e.preventDefault()
    const memberName = $('#memberNameInput').val()
    fetchMembers(memberName)
  }

  return (
    <Panel header="Members Filtering Widget">
      <form onSubmit={filterMembersOnClick.bind(this)} className="form-horizontal">
        <fieldset>
          <div className="form-group">
            <label className="col-lg-2 control-label">Member name</label>
            <Col lg={ 10 }>
              <input id='memberNameInput' type="text" placeholder="enter member's name..." className="form-control" />
              <span className="help-block m-b-none">Fetch 50 latest members if not provided</span>
            </Col>
          </div>
        </fieldset>

        <div className="form-group">
          <Col lgOffset={ 2 } lg={ 10 }>
            <Button type="submit" bsStyle="primary">Filter</Button>
            <span className="help-block m-b-none">Filter members and see results in table below</span>
          </Col>
        </div>
      </form>
    </Panel>
  )
}