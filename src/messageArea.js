import {Component} from "react";

class Message extends Component {
    render() {
        if (this.props.useruid === this.props.messageuid) {
            return (
                <div>
                {
                    this.props.hiddenSidebar ?
                        <div className="message messageSender2">
                            <p className='messageHeader messageHeader2'>{this.props.sender} {this.props.loadingToxic &&
                            <i className="fas fa fa-spinner fa-spin"></i>}</p>
                            <p className='messageText'>{this.props.text}</p>
                        </div> :
                        <div className="message messageSender">
                            <p className='messageHeader'>{this.props.sender} {this.props.loadingToxic &&
                            <i className="fas fa fa-spinner fa-spin"></i>}</p>
                            <p className='messageText'>{this.props.text}</p>
                        </div>
                }
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
        // if (this.props.messages === null)
        let messagesLength = this.props.messages.length
        let messages = this.props.messages.map((message, i) => {
            return <Message text={message.text} useruid={this.props.uid} messageuid={message.UID} time={message.time} key={i}
            sender={message.sender} hiddenSidebar={this.props.hiddenSidebar}
                            loadingToxic={i === messagesLength - 1 ? this.props.loadingToxic : false} />
        })

        return(
            <div className="messages">
                {messages}
            </div>
        )
    }
}

export default Messages