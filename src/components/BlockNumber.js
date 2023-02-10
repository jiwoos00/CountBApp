import React, { Component } from 'react'
import caver from 'klaytn/caver'
import './BlockNumber.scss'

/**
 * BlockNumber 컴포넌트는 1초(1000ms)마다 현재 블록 번호를 가져온다.
 * 현재 블록 번호는 Klaytn 노드와의 연결 및 통신을 담당하는 caver-js 라이브러리를 통해 불러올 수 있다.
 * 특정 Klaytn 노드를 연결하려면 klaytn/caver.js에서 rpcURL 설정을 변경하면 된다.
*/

export default class BlockNumber extends Component {
  // BlockNumber 컴포넌트는 currentBlockNumber를 통해 상태를 나타낸다.

  state = {
    currentBlockNumber: '...loading',
  }

  /**
   * 1) caver.klay.getBlockNumber()를 호출하여 Klaytn 노드로부터 현재 블록 번호를 가져온다.
   * 2) 1)을 통해 불러온 값을 currentBlockNumber에 저장한다.
   */
  getBlockNumber = async () => {
    const blockNumber = await caver.klay.getBlockNumber()
    this.setState({ currentBlockNumber: blockNumber })
  }

  /**
   * intervalId 값은 setInterval에서 반환된 값으로 채워진다.
   * intervalId 변수는 블록 번호를 불러오는 주기를 초기화하는 데 사용되어 메모리 누수를 방지한다.
  */
  intervalId = null

  /**
   * componentDidMount의 생명주기 동안 getBlockNumber 메서드를 주기적으로 호출한다.
   */
  componentDidMount() {
    this.intervalId = setInterval(this.getBlockNumber, 1000)
  }

  /**
   * componentWillUnmount의 생명주기 동안 1000ms 마다 getBlockNumber 호출하는 주기를 초기화한다.
  */
  componentWillUnmount() {
    if (this.intervalId) clearInterval(this.intervalId)
  }

  /**
   * render 생명주기 동안 currentBlockNumber의 상태
   * <p>Block No. {currentBlockNumber}</p>
  */
  render() {
    const { currentBlockNumber } = this.state
    return (
      <div className="BlockNumber">
        <p className="BlockNumber__current">Block No. {currentBlockNumber}</p>
      </div>
    )
  }
}


