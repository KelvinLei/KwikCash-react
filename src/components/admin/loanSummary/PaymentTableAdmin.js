import React from 'react'
import { Grid, Row, Col, Panel, Table, Button, Dropdown, MenuItem } from 'react-bootstrap';

export const PaymentTableAdmin = ({
  paymentLevelData,
}) => {
  const paymentListContent = paymentLevelData.payments.map((payment, index) => {
    const { id,
            isPaid,
            paymentDate,
            amountDue,
            amountPaid,
            scheduled,
            principal,
            paymentSchedule,
            interest } = payment

    return (
      <PaymentPlanRow key={id}
                      index={index + 1}
                      status={ isPaid ? 'Complete' : 'Pending'}
                      dueDate={paymentDate}
                      amountDue={amountDue}
                      amountPaid={amountPaid}
                      scheduleType={scheduled}
                      principal={principal}
                      interest={interest}
                      paymentSchedule={paymentSchedule}
      />
    )
  })

  return (
    <Panel className="panel-default" header="Payments Schedule">
      <Grid fluid>
        <Row>
          <Col md={12}>
            { /* payment table */ }
            <Row>
              <Table id="paymentPlantTable" responsive striped hover>
                <thead>
                <tr>
                  <th className="sort-numeric">#</th>
                  <th className="sort-alpha">Status</th>
                  <th className="sort-numeric">Due Date</th>
                  <th className="sort-numeric">Due</th>
                  <th className="sort-numeric">Paid</th>
                  <th className="sort-numeric">Principal</th>
                  <th className="sort-numeric">Interest</th>
                  <th className="sort-numeric">Scheduled</th>
                  <th className="sort-numeric">PaymentSchedule</th>
                  <th className="sort-numeric">Options</th>
                </tr>
                </thead>

                <tbody>
                { paymentListContent }
                </tbody>
              </Table>
            </Row>
          </Col>
        </Row>
      </Grid>
    </Panel>
  )
}

const PaymentPlanRow = ({
  index,
  status,
  dueDate,
  amountDue,
  amountPaid,
  scheduleType,
  principal,
  interest,
  paymentSchedule
}) => {
  var className = status === "Complete" ? "label label-success" : "label label-warning"

  return (
    <tr>
      <td>{index}</td>
      <td>
        <div className={className}>{status}</div>
      </td>
      <td>{dueDate}</td>
      <td>{'$' + amountDue}</td>
      <td>{'$' + amountPaid}</td>
      <td>{'$' + principal}</td>
      <td>{'$' + interest}</td>
      <td>{scheduleType}</td>
      <td>{paymentSchedule}</td>
      <td>
        <Button bsClass="btn btn-oval btn-info" >Edit</Button>
        <Button bsClass="btn btn-oval btn-success">Waive</Button>
        <Button bsClass="btn btn-oval btn-danger">Delete</Button>
      </td>
    </tr>
  )
}