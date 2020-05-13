import React from 'react'
import { Tab } from 'semantic-ui-react'
import { connect } from "react-redux";
import { InitMap, setMapFocus } from "../../redux/actions/map"
import { getFocusedMap } from '../../nessMapping/api'
import { resetTools } from "../../redux/actions/tools"
import './style.css'



class MapTabs extends React.Component {
    state = {
        panes: [],
        focused: ''
    }
    handleTabChange = async (uuid) => {
        if (uuid != this.state.focused) {
            if (uuid == "+") {
                await this.props.InitMap()
            } else {
                await this.props.setMapFocus(uuid)
                getFocusedMap().setTarget("map")

            }
            await this.props.resetTools()
        }
    }
    renderPanes = () => {
        const panes = []
        if (this.props.maps.uuids) {
            this.props.maps.uuids.map(

                uuid => panes.push(
                    {
                        menuItem: uuid,
                        render: () => null
                    }
                )
            )
            panes.push({
                menuItem: '+',
                pane: <div key={'addmap'}></div>,
            })
        }
        if (this.props.maps.focused) {
            getFocusedMap().setTarget("map")
        }
        this.setState({ panes, focused: this.props.maps.focused })
    }

    shouldComponentUpdate(nextProps, nextState) {
        const uuids = nextProps.maps.uuids.length
        const nextStatepanes = this.state.panes.length - 1
        const prevFocused = this.state.focused
        const nextFocused = nextProps.maps.focused
        return uuids != nextStatepanes || prevFocused != nextFocused
    }
    componentDidMount() {
        this.renderPanes()
    }

    componentDidUpdate() {
        this.renderPanes()
    }

    render() {
        return (
            <Tab menu={{ attached: 'top' }} panes={this.state.panes} className="mapTab" onTabChange={(e, meta) => this.handleTabChange(meta.panes[meta.activeIndex].menuItem)} />
        )
    }
}

const mapStateToProps = (state) => ({
    maps: state.map,
})



export default connect(mapStateToProps, {
    InitMap, setMapFocus, resetTools
})(MapTabs);