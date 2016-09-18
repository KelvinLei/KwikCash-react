import React, { Component } from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Row, Col, Panel, Table, Grid, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner'
import LoansDataTable from './LoansDataTable'
import Calender from './Calendar'
import states from './states_info'
import styles from './LoansDataTable.scss'

require('pikaday/pikaday.js')
require('pikaday/plugins/pikaday.jquery.js')
require('pikaday/css/pikaday.css')

export default class ExportLoansContent extends Component {

  componentDidMount() {
    LoansDataTable()
    Calender()
  }

  render() {
    const {} = this.props;

    const statesDropdown = states.map( (state, id) => {
      return (
        <option key={id}>{state.abbreviation} - {state.name}</option>
      )
    })

    return (
      <ContentWrapper>
        <div className="content-heading">
          Export Loans
        </div>

        <Row>
          <Col md={ 12 }>
            <Panel header="Loan Filtering Widget">

              <form className="form-horizontal">
                <fieldset>
                  <div className="form-group">
                    <label className="col-lg-2 control-label">Fund date range</label>
                    <Col lg={ 3 }>
                      <input type="text" id="start" className="form-control"/>
                      <span className="help-block m-b-none">Fund start date</span>
                    </Col>
                    <Col lg={ 3 }>
                      <input type="text" id="end" className="form-control"/>
                      <span className="help-block m-b-none">Fund end date</span>
                    </Col>
                  </div>
                </fieldset>

                <fieldset>
                  <div className="form-group">
                    <label className="col-lg-2 control-label">Loan status</label>
                    <Col sm={ 10 }>
                      <label className="radio-inline c-radio">
                        <input id="inlineradio1" type="radio" name="i-radio" value="option1" defaultChecked />
                        <em className="fa fa-circle"></em>Active
                      </label>
                      <label className="radio-inline c-radio">
                        <input id="inlineradio2" type="radio" name="i-radio" value="option2" />
                        <em className="fa fa-circle"></em>Charged off
                      </label>
                      <label className="radio-inline c-radio">
                        <input id="inlineradio3" type="radio" name="i-radio" value="option3" />
                        <em className="fa fa-circle"></em>Late
                      </label>
                      <label className="radio-inline c-radio">
                        <input id="inlineradio3" type="radio" name="i-radio" value="option3" />
                        <em className="fa fa-circle"></em>Manual
                      </label>
                      <label className="radio-inline c-radio">
                        <input id="inlineradio3" type="radio" name="i-radio" value="option3" />
                        <em className="fa fa-circle"></em>Paid
                      </label>
                      <label className="radio-inline c-radio">
                        <input id="inlineradio3" type="radio" name="i-radio" value="option3" />
                        <em className="fa fa-circle"></em>Plan
                      </label>
                    </Col>
                  </div>
                </fieldset>

                <fieldset>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">State</label>
                    <Col sm={ 10 }>
                      <Row>
                        <div className="col-lg-4">
                          <select className="form-control">
                            { statesDropdown }
                          </select>
                        </div>
                      </Row>
                    </Col>
                  </div>
                </fieldset>

                <fieldset>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">More options</label>
                    <Col sm={ 10 }>
                      <div className="checkbox c-checkbox needsclick">
                        <label className="needsclick">
                          <input standalone type="checkbox" defaultChecked value="" className="needsclick" />
                          <em className="fa fa-check"></em>Exclude Loans Under 1001</label>
                      </div>
                    </Col>
                  </div>
                </fieldset>

                <div className="form-group">
                  <Col lgOffset={ 2 } lg={ 10 }>
                    <Button type="submit" bsStyle="default" bsSize="small">Sign in</Button>
                  </Col>
                </div>
              </form>

            </Panel>
          </Col>
        </Row>

        <Grid fluid>
          <Row>
            <Col lg={ 12 }>
              <Panel header="Data Tables | Zero Configuration">
                <Table id="datatable1" responsive striped hover>
                  <thead>
                  <tr>
                    <th>Rendering engine</th>
                    <th>Browser</th>
                    <th>Platform(s)</th>
                    <th className="sort-numeric">Engine version</th>
                    <th className="sort-alpha">CSS grade</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr className="gradeX">
                    <td>Trident</td>
                    <td>Internet Explorer 4.0</td>
                    <td>Win 95+</td>
                    <td>4</td>
                    <td>X</td>
                  </tr>
                  <tr className="gradeC">
                    <td>Trident</td>
                    <td>Internet Explorer 5.0</td>
                    <td>Win 95+</td>
                    <td>5</td>
                    <td>C</td>
                  </tr>
                  <tr className="gradeA">
                    <td>Trident</td>
                    <td>Internet Explorer 5.5</td>
                    <td>Win 95+</td>
                    <td>5.5</td>
                    <td>A</td>
                  </tr>
                  <tr className="gradeA">
                    <td>Trident</td>
                    <td>Internet Explorer 6</td>
                    <td>Win 98+</td>
                    <td>6</td>
                    <td>A</td>
                  </tr>
                  <tr className="gradeA">
                    <td>Trident</td>
                    <td>Internet Explorer 7</td>
                    <td>Win XP SP2+</td>
                    <td>7</td>
                    <td>A</td>
                  </tr>
                  <tr className="gradeA">
                    <td>Trident</td>
                    <td>AOL browser (AOL desktop)</td>
                    <td>Win XP</td>
                    <td>6</td>
                    <td>A</td>
                  </tr>
                  </tbody>
                </Table>
              </Panel>
            </Col>
          </Row>
        </Grid>

      </ContentWrapper>
    )
  }
}
