// import logo from './logo.svg';
import './App.css';
import {Component} from 'react'
import Sidebar from './sidebar.js'
import Messages from './messageArea'
import InputArea from './inputArea'
import SignButton from './signInButton'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

// import {useAuthState} from "react-firebase-hooks/auth";
// import {useCollectionData} from "react-firebase-hooks/firestore";

if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyBI82kPRHClMEDPZhkD9aYT8XDHLDvbUvQ",
        authDomain: "chatappinfinite.firebaseapp.com",
        projectId: "chatappinfinite",
        storageBucket: "chatappinfinite.appspot.com",
        messagingSenderId: "112638137611",
        appId: "1:112638137611:web:4f8430d3f53728d6bc3e0e",
        measurementId: "G-0X9WLJ9149"
    })
} else {
    firebase.app();
}

const auth = firebase.auth()
const firestore = firebase.firestore()
// const analytics = firebase.analytics();

// messagesDB.add({
//     UID: 'xxxxxxxx',
//     group_name: 'group_one',
//     sender: 'filip',
//     text: 'hello world2',
//     time: 123123123
// })


const provider = new firebase.auth.GoogleAuthProvider();

let unsubscribeMessages, unsubscribeGroups


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allGroupsNames: ['groupone', 'grouptwo'],
            currentGroup: this.getURL(),
            unsubscribe: null,
            UID: null,
            userName: null,
            inputValue: null,
            signedIn: null,
            messages: [{
                time: null,
                sender: null,
                text: null,
                UID: null,
            }
            ]
        }
        this.onFieldSubmit = this.onFieldSubmit.bind(this)

        auth.onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    user: user,
                    signedIn: true,
                })
                let messagesDB = firestore.collection('messages')
                let groupsDB = firestore.collection('groups')
                this.setState({
                    UID: user.uid,
                    userName: user.displayName,
                    messagesDB: messagesDB,
                    groupsDB: groupsDB,
                })

                unsubscribeMessages = messagesDB
                    .where('group_name', '==', this.state.currentGroup)
                    .orderBy('time')
                    // .limit(15)
                    .onSnapshot(querySnapshot => {
                        let items = querySnapshot.docs.map(doc => {
                            let data = doc.data()
                            return {
                                // time: time,
                                sender: data.sender,
                                text: data.text,
                                UID: data.UID,
                                id: doc.id
                            }
                        })
                        this.setState({
                            messages: items,
                        })
                    });
                unsubscribeGroups = groupsDB.onSnapshot(querySnapshot => {
                    let items = querySnapshot.docs.map(doc => {
                        let data = doc.data()
                        return {
                            name: data.group_name,
                            description: data.description,
                            id: doc.id
                        }
                    })
                    this.setState({allGroupsNames: items})
                })
            } else {
                this.setState({
                    signedIn: false
                })
                unsubscribeMessages && unsubscribeMessages()
                unsubscribeGroups && unsubscribeGroups()
            }
        })
    }

    getURL = () => {
        let url = new URL(window.location.href)
        let groupName = url.searchParams.get('group_name')
        if (groupName) return groupName
        else return 'group_one'
    }

    onFieldChange = (e) => {
        this.setState({inputValue: e.target.value})
    }

    onFieldSubmit = (e) => {
        if (this.state.inputValue) {
            if (!this.state.user) {
                console.log('user must be logged in')
                return
            }
            const {serverTimestamp} = firebase.firestore.FieldValue;
            this.state.messagesDB.add({
                UID: this.state.UID,
                group_name: this.state.currentGroup,
                sender: this.state.userName,
                text: this.state.inputValue,
                time: serverTimestamp()
            })
            this.handleDescription()
            this.setState({inputValue: ''})
        }
        e.preventDefault()
    }

    handleDescription = () => {
        if (this.getURL() === undefined) return
        let currentGroupId
        for (let group of this.state.allGroupsNames) {
            if (group.name === this.state.currentGroup) currentGroupId = group.id
        }
        let description = ''
        if (this.state.inputValue.length > 18) description = this.state.inputValue.slice(0,18) + '...'
        else description = this.state.inputValue
        this.state.groupsDB.doc(currentGroupId).set({
            group_name: this.getURL(),
            description: description
        })
    }

    changeGroup = (groupName) => {
        console.log(groupName)
        this.setState({currentGroup: groupName})
    }

    signInBtnGoogle = () => auth.signInWithPopup(provider);

    signOutBtn = () => auth.signOut();

    render() {
        return (
            <div className="parent">
                {/*sidebar*/}
                <div className="sidebarGroups sidebar">
                    <h1>Hello, {this.state.userName}</h1>
                    <hr/>
                    <SignButton signInGoogle={this.signInBtnGoogle} signOut={this.signOutBtn} signedIn={this.state.signedIn} />
                    <Sidebar groupsName={this.state.allGroupsNames} currentGroup={this.state.currentGroup} changeGroup={this.changeGroup} />
                </div>
                {/*messageField*/}
                <div className="rightSide">
                    <header>
                        <h2>Messenger by Filip Hostinský</h2>
                    </header>
                    <main className="messagesField">
                        <div className='content'>
                            <Messages messages={this.state.messages} uid={this.state.UID}/>
                        </div>
                        {/*type form*/}
                    </main>
                    <footer className="inputArea">
                        <InputArea changeValue={this.onFieldChange} onFieldSubmit={this.onFieldSubmit}/>
                    </footer>
                </div>
            </div>
        );
    }
}

export default App;
