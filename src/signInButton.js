import {Component} from "react";

class SignButton extends Component {
    render() {
        return(
            <div>
                {this.props.signedIn ?
                    <button className='sidebarButton button' onClick={this.props.signOut}>Sign Out</button> :
                    <button className='sidebarButton button' onClick={this.props.signInGoogle}>Sign In with Google</button>}
            </div>
        )
    }
}

export default SignButton