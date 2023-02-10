import React, { Component } from 'react'
import caver from 'klaytn/caver'
import BlockNumber from 'components/BlockNumber'
import Auth from 'components/Auth'

export default class App extends Component {
  
  componentWillMount() { 
    const walletFromSession = sessionStorage.getItem('walletInstance')
    if (walletFromSession) {
      try {
        caver.klay.accounts.wallet.add(JSON.parse(walletFromSession))
      } catch (e) {
        sessionStorage.removeItem('walletInstance')
      }
    }
  }

  render() {
    return (
      <div>
        <BlockNumber />
        <Auth />
        {this.props.children}
      </div>
    )
  }
}


