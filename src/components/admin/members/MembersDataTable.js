import React, { Component } from 'react'
import { Row, Col, Panel, Table, Grid, Button } from 'react-bootstrap';
import DataTableScript from '../dataTable/DataTableScript'
import styles from '../dataTable/LoansDataTable.scss'

export default class MembersDataTable extends Component {

  MEMBERS_TABLE_DIV_ID = 'membersDataTable'

  componentDidMount() {
    DataTableScript(this.MEMBERS_TABLE_DIV_ID)
  }

  render() {
    const { members } = this.props;

    const memberRows = members.map( (member, i) => {
      return (
        <tr key={i} className="gradeX">
          <td>{member.memberName}</td>
          <td>{member.memberEmail}</td>
          <td><Button bsStyle="primary">Loans</Button></td>
        </tr>
      )
    })

    return (
      <Grid fluid>
        <Row>
          <Col lg={ 12 }>
            <Panel header={"Membrs Data Table - Total matched rows: " + members.length}>
              <Table id={this.MEMBERS_TABLE_DIV_ID} responsive striped hover>
                <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Member Email</th>
                  <th>Loans</th>
                </tr>
                </thead>
                <tbody>
                { memberRows }
                </tbody>
              </Table>
            </Panel>
          </Col>
        </Row>
      </Grid>
    )
  }
}