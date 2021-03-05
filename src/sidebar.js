import {Component} from "react";

class SidebarElement extends Component {
    render() {
        if (this.props.isActive) return(
            <div className="sidebarElement sidebarActiveElement" onClick={() => console.log('clicked')}>
                <h3>{this.props.name}</h3>
                <p>{this.props.lastMessage}</p>
            </div>
        )
        return (
            <div className="sidebarElement" onClick={() => window.open(`http://localhost:3000/?group_name=${this.props.name}`, '_self')}>
                <h3>{this.props.name}</h3>
                <p>{this.props.lastMessage}</p>
            </div>
        )

    }
}


class Sidebar extends Component {
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

export default Sidebar