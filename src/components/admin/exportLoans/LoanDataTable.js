import React from 'react'
import { Panel, Table } from 'react-bootstrap';

export const LoanDataTable = ({loans}) => {
  const loanRow = loans.map( (loan) => {
    return (
      <tr key={loan.loanNumber} className="gradeX">
        <td>{loan.loanNumber}</td>
        <td>{loan.loanStatus}</td>
        <td>{loan.firstName}</td>
        <td>{loan.lastName}</td>
        <td>{loan.loanFundAmount}</td>
        <td>{loan.loanRate}%</td>
        <td>{loan.loanNoteDate}</td>
        <td>{loan.loanFundDate}</td>
      </tr>
    )
  })
  
  return (
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
  )
}