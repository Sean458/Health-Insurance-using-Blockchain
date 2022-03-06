//SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

contract InsuranceRecord {

    struct Record {
        address patientAddr;
        string name;
        string date;
        string hospitalName;
        uint256 price;
        string ipfsHash;
        bool hSign;
        bool lSign;
        bool isValue;
    }

    mapping(address => Record) public recordList;
    uint256 public recordCount;
    address private hospitalAdmin;
    address private labAdmin;

    constructor() public {
        hospitalAdmin = 0x332421378d6D471C8D1FaEE94c662DA0f8717C59;
        labAdmin = 0xC19Dc426cf4960e522B4d57C8B172927d0618460;
    }

    event recordCreated(address patientAddr, string name, string date, string hospitalName, uint256 price, string ipfsHash);
    event recordSigned(address patientAddr, string name, string date, string hospitalName, uint256 price, string ipfsHash);

    function newRecord(string memory _name, string memory _date, string memory _hospitalName, uint256 _price, string memory _ipfsHash) public {
        require(!recordList[msg.sender].isValue);
        recordList[msg.sender] = Record(msg.sender, _name, _date, _hospitalName, _price, _ipfsHash, false, false, true);
        recordCount++;
        emit recordCreated(msg.sender, _name, _date, _hospitalName, _price, _ipfsHash);
    }

    modifier validatorsOnly {
        require(msg.sender == hospitalAdmin || msg.sender == labAdmin);
        _;
    }

    function signRecord(address patientAddr) validatorsOnly public {
        Record storage _record = recordList[patientAddr];
        require((!_record.hSign && msg.sender==hospitalAdmin) || (!_record.lSign && msg.sender==labAdmin));
        
        if(msg.sender==hospitalAdmin){
            _record.hSign=true;
            }
            
        else{
            _record.lSign=true;
            }

        if(_record.hSign && _record.lSign) {
            emit recordSigned(_record.patientAddr, _record.name, _record.date, _record.hospitalName, _record.price, _record.ipfsHash);
        }
    }

    function getIPFS(address patientAddr) public view returns(string memory) {
        return recordList[patientAddr].ipfsHash;
    }

    function checkRecord(address patientAddr) public view returns(bool) {
        return recordList[patientAddr].isValue;
    }

    // function getList() public view returns(Record[] memory) {
    //     return recordList;
    // }
}
