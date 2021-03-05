import {Component} from "react";

class InputArea extends Component {
    render() {
        return(
            <form onSubmit={this.props.onFieldSubmit} className="form">
                <input type="text" onChange={this.props.changeValue} id='inputText' placeholder='Please, type a message' />
                <input type="submit" value='submit' id='inputButton' className='button' />
            </form>
        )
    }
}

export default InputArea