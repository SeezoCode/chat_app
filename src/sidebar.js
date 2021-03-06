import {Component} from "react";

export class SidebarHider extends Component {
    render() {
        return(<button className='button hiderButton' onClick={this.props.hideShowHandler}>{this.props.state ? 'Show Sidebar' : 'Hide Sidebar'}</button>)
    }
}


class SidebarElement extends Component {
    render() {
        if (this.props.isActive) return(
            <div className="sidebarElement sidebarActiveElement" onClick={() => console.log('clicked')}>
                <h3>{this.props.name}</h3>
                <p>{this.props.lastMessage}</p>
            </div>
        )
        return (
            <div className="sidebarElement" onClick={() => window.open(
                `${window.location.protocol + window.location.host}/?group_name=${this.props.name}`, '_self')}>
                <h3>{this.props.name}</h3>
                <p>{this.props.lastMessage}</p>
            </div>
        )
    }
}


export class Sidebar extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let groupsNameArray = this.props.groupsName.map((elem, i) => {
            return <SidebarElement name={elem.name} lastMessage={elem.description} key={i}
                                   isActive={this.props.currentGroup === elem.name} changeGroup={() => this.props.changeGroup(elem.name)} />
        })
        return(
            <div className="sidebarElements">
                {groupsNameArray}
            </div>
        )
    }
}

export default {Sidebar: Sidebar, SidebarHider: SidebarHider}