import React, { Component } from 'react'

export default class App extends Component {
    render() {
        return (
            <div>
                <div className="col-sm-6">
                    Hello world! In Home page.
                </div>
                <div className="col-sm-3">
                    Second column
                </div>
                <div className="col-sm-3">
                    Third column
                </div>
            </div>
        )
    }
}
