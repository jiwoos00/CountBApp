import React, { Component } from 'react'
import cx from 'classnames'
import caver from 'klaytn/caver'

import './Count.scss'

export default class Count extends Component {
  constructor() {
    super()
    // ** 1. 컨트랙트 인스턴스 생성 **
    // ex:) new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS)
    // 인스턴스를 통해 컨트랙트 메서드 호출 가능
    // this.countContract 변수로 인스턴스에 접근 가능
    this.countContract = DEPLOYED_ABI
      && DEPLOYED_ADDRESS
      && new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS)
    this.state = {
      count: '',
      lastParticipant: '',
      isSetting: false,
    }
  }

  intervalId = null

  getCount = async () => {
    // ** 2. 컨트랙트 메서드 호출 **
    // ex:) this.countContract.methods.methodName(arguments).call()
    // ex:) this.countContract.methods.count().call()
    // Promise를 반환하기 때문에 .then() 또는 async-await으로 접근
    const count = await this.countContract.methods.count().call()
    const lastParticipant = await this.countContract.methods.lastParticipant().call()
    this.setState({
      count,
      lastParticipant,
    })
  }

  setPlus = () => {
    const walletInstance = caver.klay.accounts.wallet && caver.klay.accounts.wallet[0]

    if (!walletInstance) return
    this.setState({ settingDirection: 'plus' })

    // 3. ** 컨트랙트 메서드 호출 (SEND) **
    // ex:) this.countContract.methods.methodName(arguments).send(txObject)
    // ex:) this.countContract.methods.plus().send({
    //   from: '0x952A8dD075fdc0876d48fC26a389b53331C34585', // PUT YOUR ADDRESS
    //   gas: '200000',
    // })
    try{
      this.countContract.send({
        from: walletInstance.address,
        gas: '200000',
      }, 'plus')
        .then((receipt) => {
          console.log(`
            Received receipt! It means your transaction(calling plus function)
            is in klaytn block(#${receipt.blockNumber})
          `, receipt)
          this.setState({
            settingDirection: null,
            txHash: receipt.transactionHash,
          })
        })
    } catch (error) {
      alert(err.message)
      this.setState({ settingDirection: null })
    }
  }

  setMinus = () => {
    const walletInstance = caver.klay.accounts.wallet && caver.klay.accounts.wallet[0]

    if (!walletInstance) return
    this.setState({ settingDirection: 'minus' })

    // 3. 컨트랙트 메서드 호출 (SEND) **
    // ex:) this.countContract.methods.methodName(arguments).send(txObject)
    // ex:) this.countContract.methods.minus().send({
    //   from: '0x952A8dD075fdc0876d48fC26a389b53331C34585', // PUT YOUR ADDRESS
    //   gas: '200000',
    // })

    // event emiiter 반환하므로 전송 후 이벤트로 결과를 받아올 수 있다.
    // .on('transactionHash') 이벤트를 사용한다.
    // 트랜잭션 전송 후 로직을 처리하려는 경우, .once('receipt') 이벤트를 사용한다.
    // 트랜잭션이 블록에 포함된 후 로직을 처리하려는 경우
    // ex:) .once('receipt', (data) => {
    //   console.log(data)
    // })
    try{
      this.countContract.send({
        from: walletInstance.address,
        gas: '200000',
      }, 'minus')
        .then((receipt) => {
          console.log(`
            Received receipt! It means your transaction(calling minus function)
            is in klaytn block(#${receipt.blockNumber})
          `, receipt)
          this.setState({
            settingDirection: null,
            txHash: receipt.transactionHash,
          })
        })
    } catch (error) {
      alert(err.message)
      this.setState({ settingDirection: null })
    }
  }

  componentDidMount() {
    this.intervalId = setInterval(this.getCount, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  render() {
    const { lastParticipant, count, settingDirection, txHash } = this.state
    return (
      <div className="Count">
        {Number(lastParticipant) !== 0 && (
          <div className="Count__lastParticipant">
            last participant: {lastParticipant}
          </div>
        )}
        {txHash && (
          <div className="Count__lastTransaction">
           
            <a
              target="_blank"
              href={`https://baobab.klaytnfinder.io/tx/${txHash}`}
              className="Count__lastTransactionLink"
            >
              {txHash}
            </a>
          </div>
        )}
        
        <div className="Count__img">
          <div 
            className="ball"
          >
            {count}
          </div>
        </div>
        <style jsx>{`
          .ball {
            width:${50+(count*10)}px;
            height:${50+(count*10)}px;
            border-radius:50%
          }
        `}</style>
        
        <button
          onClick={this.setPlus}
          className={cx('Count__button', {
            'Count__button--setting': settingDirection === 'plus',
          })}
        >
          +
        </button>
        <button
          onClick={this.setMinus}
          className={cx('Count__button', {
            'Count__button--setting': settingDirection === 'minus',
          })}
          disabled={count == 0}
        >
          -
        </button>
        
      </div>
    )
  }
}


