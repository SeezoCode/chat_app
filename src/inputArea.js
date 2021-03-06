import {Component} from "react";

class InputArea extends Component {
    onFieldSubmit = (e) => {
        this.props.onFieldSubmit(e)
        document.getElementById("form").reset()
    }

    render() {
        return(
            <form onSubmit={this.onFieldSubmit} className="form" id='form'>
                {!this.props.state ?
                    <input type="text" onChange={this.props.changeValue} id='inputText'
                           placeholder='Please, type a message' autoComplete='off'/> :
                    <input type="text" onChange={this.props.changeValue} id='inputText2'
                           placeholder='Please, type a message' autoComplete='off'/>

                }
                {/*<input type="submit" value='submit' id='inputButton' className='button hiderButton' />*/}
            </form>
        )
    }
}

export default InputArea