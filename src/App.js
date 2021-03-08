// import logo from './logo.svg';
import './App.css';
import {Component} from 'react'
import {Sidebar, SidebarHider} from './sidebar.js'
import Messages from './messageArea'
import InputArea from './inputArea'
import SignButton from './signInButton'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/analytics'

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
const analytics = firebase.analytics()

const provider = new firebase.auth.GoogleAuthProvider();

let unsubscribeMessages, unsubscribeGroups


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allGroupsNames: [],
            hidden: false,
            currentGroup: this.getURL(),
            unsubscribe: null,
            formValue: '',
            loadingToxic: false,
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
    }

    componentDidMount() {
        analytics.logEvent('componentDidMount', {name: this.getURL()});

        auth.onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    user: user,
                    signedIn: true,
                })
                let messagesDB = firestore.collection('messages')
                let groupsDB = firestore.collection('group_names')
                this.setState({
                    UID: user.uid,
                    userName: user.displayName,
                    messagesDB: messagesDB,
                    groupsDB: groupsDB,
                })

                unsubscribeMessages = messagesDB
                    .where('group_name', '==', this.state.currentGroup)
                    .orderBy('time')
                    .limitToLast(20)
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
                unsubscribeGroups = groupsDB
                    // .where('public', '!=', false)
                    // .orderBy('public')
                    .orderBy('time')
                    .limitToLast(4)
                    .onSnapshot(querySnapshot => {
                        let items = querySnapshot.docs.map(doc => {
                            let data = doc.data()
                            return {
                                name: data.group_name,
                                description: data.description,
                                id: doc.id
                            }
                        })
                        items.reverse()
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
        else {
            return 'Default Group'
        }
    }

    hideShowHandler = () => {
        this.setState({hidden: !this.state.hidden})
    }

    onFieldChange = (e) => {
        this.setState({inputValue: e.target.value})
    }

    onFieldSubmit = (e) => {
        let funcInputValue = this.state.inputValue
        if (this.state.inputValue) {
            if (!this.state.signedIn) {
                alert('User must be logged in')
                return
            }
            const serverTimestamp = firebase.firestore.Timestamp.now();
            this.state.messagesDB.add({
                UID: this.state.UID,
                group_name: this.state.currentGroup,
                sender: this.state.userName,
                text: this.state.inputValue,
                time: serverTimestamp
            }).then((doc) => {
                this.getToxicity(doc.id, serverTimestamp, funcInputValue)
            })
            this.handleDescription()
            this.setState({inputValue: ''})
        }
        e.preventDefault()
    }

    getToxicity (docId, time, sentence) {
        if (!sentence[0]) return
        this.setState({loadingToxic: true})
        console.log(sentence)
        // eslint-disable-next-line no-undef
        toxicity.load(.8).then(model => {
            model.classify([sentence]).then(predictions => {
                let map = predictions.map(prediction => {
                    if (prediction.results[0].match) return prediction.label;
                    else return ''
                }).filter(prediction => prediction)
                map = map.join(', ')
                console.log(map)
                if (!map) map = 'not toxic'
                console.log(map)
                this.state.messagesDB.doc(docId).set({
                    UID: this.state.UID,
                    group_name: this.state.currentGroup,
                    sender: `${this.state.userName}, ${map}`,
                    text: sentence,
                    time: time
                }).then(() => this.setState({loadingToxic: false}))
            });
        });
    }

    handleDescription = () => {
        if (this.getURL() === undefined) return
        let currentGroupId
        for (let group of this.state.allGroupsNames) {
            if (group.name === this.state.currentGroup) {
                currentGroupId = group.id
            }
        }
        let description = ''
        if (this.state.inputValue.length > 18) description = this.state.inputValue.slice(0,18) + '...'
        else description = this.state.inputValue
        this.state.groupsDB.doc(currentGroupId).set({
            group_name: this.getURL(),
            description: description,
            time: firebase.firestore.FieldValue.serverTimestamp(),
        })
    }

    changeGroup = (groupName) => {
        console.log(groupName)
        this.setState({currentGroup: groupName})
    }

    signInBtnGoogle = () => auth.signInWithPopup(provider);

    signOutBtn = () => auth.signOut();

    scroll = () => {
        try {
            let messageText = document.getElementsByClassName('messageText')
            messageText[messageText.length - 1].scrollIntoView()
        }
        catch (e) {}
    }

    render() {
        return (
            <div className="parent">
                {/*sidebar*/}
                {!this.state.hidden &&
                <div className="sidebarGroups sidebar">
                    <h1>Hello, {this.state.userName}</h1>
                    <hr/>
                    <SignButton signInGoogle={this.signInBtnGoogle} signOut={this.signOutBtn} signedIn={this.state.signedIn} />
                    <Sidebar groupsName={this.state.allGroupsNames} currentGroup={this.state.currentGroup} changeGroup={this.changeGroup} />
                </div>}
                {/*messageField*/}
                <div className="rightSide">
                    <header>
                        <SidebarHider hideShowHandler={this.hideShowHandler} state={this.state.hidden} /> <span>{this.getURL()}</span>
                    </header>
                    <main className="messagesField">
                        <div className='content'>
                            <Messages messages={this.state.messages} uid={this.state.UID} hiddenSidebar={this.state.hidden}
                                      loadingToxic={this.state.loadingToxic}/>
                        </div>
                        {/*type form*/}
                    </main>

                    <footer className="inputArea">
                        <InputArea changeValue={this.onFieldChange} onFieldSubmit={this.onFieldSubmit}
                                   state={this.state.hidden} />
                    </footer>
                </div>
                {this.scroll()}
            </div>
        );
    }
}

export default App;
