import React, { Component, Fragment } from 'react'
import cx from 'classnames'
import caver from 'klaytn/caver'

import './Auth.scss'

/**
 * Auth 컴포넌트는 권한을 관리한다.
 * 두가지 함수를 제공한다.
 * 1) keystore(json file) + password
 * 2) privatekey
 */
 export default class Auth extends Component {
  constructor() {
    super()
    this.state = {
      accessType: 'keystore', // || 'privateKey'
      keystore: '',
      keystoreMsg: '',
      password: '',
      privateKey: '',
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  /**
   * 초기 상태로 reset
  */
  reset = () => {
    this.setState({
      keystore: '',
      privateKey: '',
      password: '',
      keystoreMsg: ''
    })
  }


  /**
   * 키 스토어와 비밀번호를 이용해 로그인 가능
   * handleImport, handleLogin 메서드 필요
  */

  handleImport = (e) => {
    // e.target.files[0]에 대한 메타 정보 포함
    const keystore = e.target.files[0]

    // FileReader는 파일의 내용을 읽어오는 데 사용
    // onload, readAsText 메서드 사용
    
    // * FileReader.onload
    // 읽기 작업이 완료될 때마다 발생

    // * FileReader.readAsText()
    // 내용 읽어오기
    const fileReader = new FileReader()
    fileReader.onload = (e) => {
      try {
        if (!this.checkValidKeystore(e.target.result)) {
          this.setState({ keystoreMsg: 'Invalid keystore file.' })
          return
        }

        // 키스토어 파일이 있을 때,
        // 1) e.target.result를 keystore로 설정
        // 2) 메시지 출력
        this.setState({
          keystore: e.target.result,
          keystoreMsg: 'It is valid keystore. input your password.',
          keystoreName: keystore.name,
        }, () => document.querySelector('#input-password').focus())
      } catch (e) {
        this.setState({ keystoreMsg: 'Invalid keystore file.' })
        return
      }
    }
    fileReader.readAsText(keystore) 
  }

  checkValidKeystore = (keystore) => {
    // e.target.result is popultaed by keystore contents.
    // Since keystore contents is JSON string, we should parse it to use.
    const parsedKeystore = JSON.parse(keystore)

    // Valid key store has 'version', 'id', 'address', 'crypto' properties.
    const isValidKeystore = parsedKeystore.version &&
      parsedKeystore.id &&
      parsedKeystore.address &&
      parsedKeystore.crypto

    return isValidKeystore
  }

  /**
   * handleLogin method
   */
  handleLogin = () => {
    const { accessType, keystore, password, privateKey } = this.state

    // Access type2: 개인키를 통한 접근
    if (accessType == 'privateKey') {
      this.integrateWallet(privateKey)
      return
    }

    // Access type1: 키스토어+비밀번호
    try {
      const { privateKey: privateKeyFromKeystore } = caver.klay.accounts.decrypt(keystore, password)
      this.integrateWallet(privateKeyFromKeystore)
    } catch (e) {
      this.setState({ keystoreMsg: `Password doesn't match.` })
    }
  }

  /**
   * getWallet method get wallet instance from caver.
   */
  getWallet = () => {
    if (caver.klay.accounts.wallet.length) {
      return caver.klay.accounts.wallet[0]
    }
  }

  /**
   * integrateWallet은 개인키로 로그인하는 방법이다.
   * 1) 개인키를 지갑 인스턴스 변수에 저장한다.
   * 2) 인스턴스 변수를 caver에 추가한다.
   * 3) 세션 저장소에 JSON 문자열로 값을 저장한다.  
   * cf) 사용자가 브라우저 탭을 닫으면 세션 저장소의 항목이 사라진다.
   * 4) 입력을 지우기 위해 현재 구성요소의 상태를 초기 상태로 재설정한다.
  */
  integrateWallet = (privateKey) => {
    const walletInstance = caver.klay.accounts.privateKeyToAccount(privateKey)
    caver.klay.accounts.wallet.add(walletInstance)
    sessionStorage.setItem('walletInstance', JSON.stringify(walletInstance))
    this.reset()
  }

  /**
   * removeWallet method
   * 로그아웃하고 브라우저에서 지갑 인스턴스 정보 제거
   * 1) caver에서 지갑 인스턴스 제거
   * 2) 세션 저장소에서 지갑 인스턴스 제거
   */
  removeWallet = () => {
    caver.klay.accounts.wallet.clear()
    sessionStorage.removeItem('walletInstance')
    this.reset()
  }

  /**
   * toggleAccessType method toggles access type
   * 1) By keystore.
   * 2) By private key.
   * After toggling access type, reset current state to intial state.
   */
  toggleAccessType = () => {
    const { accessType } = this.state
    this.setState({
      accessType: accessType === 'privateKey' ? 'keystore' : 'privateKey'
    }, this.reset)
  }

  renderAuth = () => {
    const { keystore, keystoreMsg, keystoreName, accessType } = this.state
    const walletInstance = this.getWallet()
    
    if (walletInstance) {
      return (
        <Fragment>
          <label className="Auth__label">Integrated: </label>
          <p className="Auth__address">{walletInstance.address}</p>
          <button className="Auth__logout" onClick={this.removeWallet}>Logout</button>
        </Fragment>
      )
    }

    return (
      <Fragment>
        {accessType === 'keystore'
          // View 1: Access by keystore + password.
          ? (
            <Fragment>
              <div className="Auth__keystore">
                <p className="Auth__label" htmlFor="keystore">Keystore:</p>
                <label className="Auth__button" htmlFor="keystore">Upload</label>
                <input
                  className="Auth__file"
                  id="keystore"
                  type="file"
                  onChange={this.handleImport}
                  accept=".json"
                />
                <p
                  className="Auth__fileName">
                  {keystoreName || 'No keystore file'}
                </p>
              </div>
              <label className="Auth__label" htmlFor="password">Password:</label>
              <input
                id="input-password"
                className="Auth__passwordInput"
                name="password"
                type="password"
                onChange={this.handleChange}
              />
            </Fragment>
          )
          // View 2: Access by private key.
          : (
            <Fragment>
              <label className="Auth__label">Private Key:</label>
              <input
                className="Auth__input"
                name="privateKey"
                onChange={this.handleChange}
              />
            </Fragment>
          )
        }
        <button className="Auth__button" onClick={this.handleLogin}>Login</button>
        <p className="Auth__keystoreMsg">{keystoreMsg}</p>
        <p className="Auth__toggleAccessButton" onClick={this.toggleAccessType}>
          {accessType === 'privateKey'
            ? 'Want to login with keystore? (click)'
            : 'Want to login with privatekey? (click)'
          }
        </p>
      </Fragment>
    )
  }

  render() {
    const { keystore } = this.state
    return (
      <div className={cx('Auth', {
        // If keystore file is imported, Adds a 'Auth--active' classname.
        'Auth--active': !!keystore,
      })}
      >
        <div className="Auth__flag" />
        <div className="Auth__content">
          {this.renderAuth()}
        </div>
      </div>
    )
  }
}


