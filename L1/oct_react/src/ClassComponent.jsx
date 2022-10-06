import React, { Component } from 'react'

export default class ClassComponent extends Component {

    constructor(props) {
        super(props)
        this.state = { show: "constructor", stateChange: "" }
        console.log("1.Gọi đầu tiên", this.state)
        this.changeClassComponentState = this.changeClassComponentState.bind(this)
    }

    static getDerivedStateFromProps(props, state) {
        console.log("2.Constructor gọi đầu tiên, gọi  getDerivedStateFromProps trước khi render ra HTML ", state.show + " HTML ", props.statechange)
        return { show: "getDerivedSateFromProps", stateChange: props.statechange }
    }

    componentDidMount() {
        this.setState({ show: "componentDidMount" })
        console.log("4.Constructor gọi đầu tiên, Gọi getDerivedStateFromProps trước khi render ra HTML, render HTML, hiển thị HTML xong sẽ nhìn thấy ", this.state.show)
    }

    changeClassComponentState() {
        this.setState({ stateChange: "Click state change" }, () => {
            console.log("Change state change", this.state.stateChange)
        })
    }

    componentDidUpdate() {
        console.log("Thấy dòng này sau khi thấy giao diện được render xong")
    }

    componentWillUnmount() {
        alert("ClassComponent will unmount")
    }

    render() {
        return (
            <>
                {/* {this.setState({show: "render"})}  */}
                {console.log("3.Constructor gọi đầu tiên, gọi getDerivedStateFromProps trước khi render HTML, ", this.state.show, " HTML")}
                <div>ClassComponent</div>
                <button type='button' onClick={this.changeClassComponentState}>Đổi class component props</button>
            </>
        )
    }
}
