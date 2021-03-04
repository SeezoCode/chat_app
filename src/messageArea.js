import {Component} from "react";

class Message extends Component {
    render() {
        if (this.props.name === this.props.sender) {
            return (
                <div className="message messageSender">
                    <p>{this.props.name} at {this.props.time}</p>
                    <p>{this.props.text}</p>
                </div>
            )
        }
        else {
            return (
                <div className="message">
                    <p>{this.props.name} at {this.props.time}</p>
                    <p>{this.props.text}</p>
                </div>
            )
        }
    }
}


class Messages extends Component {
    render() {
        let messages = this.props.messages.map(message => {
            return <Message text={message.text} name={message.name} time={message.time} key={message.time}
                            sender={this.props.senderName} />
        })

        return(
            <div className="messages">
                {messages}
            </div>
        )
    }
}

export default Messages