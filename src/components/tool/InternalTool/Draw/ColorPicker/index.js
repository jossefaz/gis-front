import React from 'react'
import { SketchPicker } from 'react-color'
import './styles.css'

class SketchExample extends React.Component {
    state = {
        displayColorPicker: false,
        color: {
            r: '241',
            g: '112',
            b: '19',
            a: '1',
        },
    };

    componentDidMount() {
        if (this.props.defaultColor)
            this.setState({ color: this.props.defaultColor })
    }

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    handleChange = (color) => {
        this.setState({ color: color.rgb })
        this.props.onColorChange(color.rgb)
    };

    render() {

        return (
            <div>
                <div className="swatch" onClick={this.handleClick}>
                    <div className="color" style={{ background: `rgba(${this.state.color.r}, ${this.state.color.g}, ${this.state.color.b}, ${this.state.color.a})` }} />
                </div>
                {this.state.displayColorPicker ? <div className="popover">
                    <div className="cover" onClick={this.handleClose} />
                    <SketchPicker color={this.state.color} onChange={this.handleChange} />
                </div> : null}

            </div>
        )
    }
}

export default SketchExample