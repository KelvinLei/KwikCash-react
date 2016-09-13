import React, { Component } from 'react'
import Header from '../../../themeJsx/Layout/Header'

export default class TopHeader extends Component {
  render() {
    const { isAdminPage } = this.props
    
    return (
      <div>
        <Header isAdminPage={isAdminPage}/>
      </div>
    )
  }
}
