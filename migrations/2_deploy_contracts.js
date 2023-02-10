const Count = artifacts.require('./Count.sol')
const fs = require('fs')

// 계약 ABI와 배포된 주소 파일에 저장
module.exports = function (deployer) {
  deployer.deploy(Count)
    .then(() => {
    if (Count._json) {
      // deployedABI에 abi 파일 저장
      fs.writeFile(
        'deployedABI',
        JSON.stringify(Count._json.abi, 2),
        (err) => {
          if (err) throw err
          console.log(`The abi of ${Count._json.contractName} is recorded on deployedABI file`)
        })
    }
    // deployedAddress 파일에 최근에 배포된 컨트랙트 주소 기록
    fs.writeFile(
      'deployedAddress',
      Count.address,
      (err) => {
        if (err) throw err
        console.log(`The deployed contract address * ${Count.address} * is recorded on deployedAddress file`)
    })
  })
}
