import {Component} from "react";

class Message extends Component {
    render() {
        if (this.props.useruid === this.props.messageuid) {
            return (
                <div className="message messageSender">
                    <p className='messageHeader'>{this.props.sender}</p>
                    <p className='messageText'>{this.props.text}</p>
                </div>
            )
        }
        else {
            return (
                <div className="message">
                    <p className='messageHeader'>{this.props.sender}</p>
                    <p className='messageText'>{this.props.text}</p>
                </div>
            )
        }
    }
}


class Messages extends Component {
    render() {
        let messages = this.props.messages.map(message => {
            return <Message text={message.text} useruid={this.props.uid} messageuid={message.UID} time={message.time} key={message.id}
            sender={message.sender} />
        })

        return(
            <div className="messages">
                {messages}
            </div>
        )
    }
}

export default Messages