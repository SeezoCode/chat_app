import {Component} from "react";

export class SidebarHider extends Component {
    render() {
        return(<button className='button hiderButton' onClick={this.props.hideShowHandler}>{this.props.state ? 'Show Sidebar' : 'Hide Sidebar'}</button>)
    }
}


class SidebarElement extends Component {
    onClickElem = () => {
        window.open(`/?group_name=${this.props.name}`, '_self')
    }

    render() {
        if (this.props.isActive) return(
            <div className="sidebarElement sidebarActiveElement" onClick={() => console.log('clicked')}>
                <h3>{this.props.name}</h3>
                <p>{this.props.lastMessage}</p>
            </div>
        )
        return (
            <div className="sidebarElement" onClick={this.onClickElem}>
                <h3>{this.props.name}</h3>
                <p>{this.props.lastMessage}</p>
            </div>
        )
    }
}


class SidebarElementAddGroup extends Component {
    onClickElem = () => {
        let p = prompt("Please enter group name")
        if (p) window.open(`/?group_name=${p}`, '_self')
    }

    render() {
        return (
            <div className="sidebarElement" onClick={this.onClickElem}>
                <p>{this.props.lastMessage}</p>
            </div>
        )
    }
}


export class Sidebar extends Component {
    render() {
        let groupsNameArray = this.props.groupsName.map((elem, i) => {
            return <SidebarElement name={elem.name} lastMessage={elem.description} key={i}
                                   isActive={this.props.currentGroup === elem.name} changeGroup={() => this.props.changeGroup(elem.name)} />
        })
        return(
            <div className="sidebarElements">
                <p>Latest active groups:</p>
                {groupsNameArray}
                <SidebarElementAddGroup lastMessage='Hidden groups' />
            </div>
        )
    }
}

// export default {Sidebar: Sidebar, SidebarHider: SidebarHider}