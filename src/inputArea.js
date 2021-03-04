import {Component} from "react";

class InputArea extends Component {
    render() {
        return(
            <form onSubmit={this.props.onFieldSubmit}>
                <input type="text" onChange={this.props.changeValue} id='inputText' placeholder='Please, type a message' />
                <input type="submit" value='submit' id='inputButton' />
            </form>
        )
    }
}

export default InputArea