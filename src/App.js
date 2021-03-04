import logo from './logo.svg';
import './App.css';
import { Component } from 'react'
import Sidebar from './sidebar.js'
import Messages from './messageArea'
import InputArea from './inputArea'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData} from "react-firebase-hooks/firestore";


firebase.initializeApp({
    apiKey: "AIzaSyBI82kPRHClMEDPZhkD9aYT8XDHLDvbUvQ",
    authDomain: "chatappinfinite.firebaseapp.com",
    projectId: "chatappinfinite",
    storageBucket: "chatappinfinite.appspot.com",
    messagingSenderId: "112638137611",
    appId: "1:112638137611:web:4f8430d3f53728d6bc3e0e",
    measurementId: "G-0X9WLJ9149"
})

const auth = firebase.auth()
const firestore = firebase.firestore()
// const analytics = firebase.analytics();


function SignIn() {

    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }

    return (
        <>
            <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
            <p>Do not violate the community guidelines or you will be banned for life!</p>
        </>
    )

}

function SignOut() {
    return auth.currentUser && (
        <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
    )
}



let groups = [
    {
        name: 'firstGroup',
        messages: [{
                name: 'filip',
                time: 11,
                text: 'hello world'
            },
            {
                name: 'fisdflip',
                time: 12,
                text: 'hello sunshine'
            },
            {
                name: 'fisfdlip',
                time: 13,
                text: 'hello darkness (my old friend)'
            }]
    },
    {
        name: 'secondGroup',
        messages: [{
                name: 'filip',
                time: 11,
                text: 'hello no one'
            },
            {
                name: 'filip',
                time: 12,
                text: 'hello sunshine'
            },
            {
                name: 'filip',
                time: 13,
                text: 'hello darkness (my old friend)'
            }]
    }
]







class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allGroupsNames: groups.map(g => {return (g.name)}),
            currentGroup: groups[0],
            name: 'filip',
            inputValue: '',
        }
        this.onFieldSubmit = this.onFieldSubmit.bind(this)
    }

    onFieldChange = (e) => {
        this.setState({inputValue: e.target.value})
        console.log(e.target.value)
    }

    onFieldSubmit = (e) => {
        console.log(e)
        this.state.currentGroup.messages.push({
            time: Date.now(),
            name: 'filip',
            text: this.state.inputValue,
        })
        this.setState({inputValue: ''})
        e.preventDefault()
    }

    render() {
        let groupMessages = this.state.currentGroup.messages.map(message => {
            return message
        })
        console.log(groupMessages)

        return (
            <div className="parent">
                {/*sidebar*/}
                <div className="sidebarGroups sidebar">
                    <h1>Hello, {'Filip Hostinsky'}</h1> <hr />
                    <Sidebar groupsName={this.state.allGroupsNames} />
                </div>
                {/*messageField*/}
                <div className="messagesField">
                    <div className='content'>
                        <Messages messages={groupMessages} senderName={this.state.name} />
                    </div>
                    {/*type form*/}
                    <div className="inputArea">
                        <InputArea changeValue={this.onFieldChange} onFieldSubmit={this.onFieldSubmit} />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
