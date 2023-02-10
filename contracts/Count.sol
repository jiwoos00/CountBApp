pragma solidity ^0.5.6;

/*

  * 변수 *
  1) count - 기본값은 0,
             plus, minus 함수에 의해 증가하거나 감소한다.
  2) lastParticipant - 마지막 Count 컨트랙트에 트랜잭션을 전송한 참여자의 주소가 기록된다.
  
  * 함수 *
  두가지 함수가 존재한다.
  1) plus - count=count+1
  2) minus - count=count-1
*/


contract Count {
    uint256 public count = 0;
    address public lastParticipant;

    function plus() public {
        count++;
        lastParticipant = msg.sender;
    }

    function minus() public {
        count--;
        lastParticipant = msg.sender;
    }
}
