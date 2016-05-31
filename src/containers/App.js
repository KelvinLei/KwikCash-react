import React, { Component } from 'react'

export default class App extends Component {
    render() {
        return (
            <div className="container-fluid">
                <div className="col-sm-3">
                    <ul className="nav nav-pills nav-stacked">
                        <li><a href="#">Brand Image</a></li>
                        <li className="active"><a href="#">Loan Summary</a></li>
                        <li><a href="#">Payment Select</a></li>
                        <li><a href="#">Re-finance</a></li>
                        <li><a href="#">Log Out</a></li>
                        <li className="disabled"><a href="#">Disabled</a></li>
                        <li className="dropdown">
                            <a className="dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="false">
                                Dropdown <span className="caret"/>
                            </a>
                            <ul className="dropdown-menu">
                                <li><a href="#">Action</a></li>
                                <li><a href="#">Another action</a></li>
                                <li><a href="#">Something else here</a></li>
                                <li className="divider"/>
                                <li><a href="#">Separated link</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>

                <div className="col-sm-9">
                    <nav className="navbar navbar-inverse">
                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            <ul className="nav navbar-nav">
                                <li className="active"><a href="#">Link <span className="sr-only">(current)</span></a></li>
                                <li><a href="#">Link</a></li>
                                <li className="dropdown">
                                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                                        My Account <span className="caret"></span>
                                    </a>
                                    <ul className="dropdown-menu" role="menu">
                                        <li><a href="#">Action</a></li>
                                        <li><a href="#">Another action</a></li>
                                        <li><a href="#">Something else here</a></li>
                                        <li className="divider"></li>
                                        <li><a href="#">Separated link</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
        )
    }
}
