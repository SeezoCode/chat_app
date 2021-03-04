import {Component} from "react";

class SidebarElement extends Component {
    render() {
        return(
            <div className="sidebarElement" onClick={() => console.log('clicked')}>
                <h3>{this.props.name}</h3>
                <p>{this.props.lastMessage}</p>
            </div>
        )
    }
}


class Sidebar extends Component {
    render() {
        let groupsNameArray = this.props.groupsName.map(elem => {
            return <SidebarElement name={elem} lastMessage={'something depressed'} key={elem} />
        })
        return(
            <div className="sidebarElements">
                {groupsNameArray}
            </div>
        )
    }
}

export default Sidebar