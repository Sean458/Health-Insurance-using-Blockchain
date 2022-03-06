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
    
    struct Hospital {
        address hospitalAddr;
        string hospitalName;
        bool isValue;
        address[] patientAddrList;
    }

    mapping(string => Hospital) public hospitals;
    mapping(address => Record) public recordList;
    uint256 public recordCount;
    address private hospitalAdmin;
    address private labAdmin;

    constructor() public {
        hospitalAdmin = 0x332421378d6D471C8D1FaEE94c662DA0f8717C59;
        labAdmin = 0x0000000000000000000000000000000000000000;
    }

    event recordCreated(address patientAddr, string name, string date, string hospitalName, uint256 price, string ipfsHash);
    event recordSigned(address patientAddr, string name, string date, string hospitalName, uint256 price, string ipfsHash);

    function newHospital(string memory _hospitalName) public {
        require(!hospitals[_hospitalName].isValue);
        // address[] memory _patientAddrList = [0x0000000000000000000000000000000000000000];
        Hospital memory h;
        h.hospitalAddr = msg.sender;
        h.hospitalName = _hospitalName;
        h.isValue = true;
        hospitals[_hospitalName] = h;
    }

    function newRecord(string memory _name, string memory _date, string memory _hospitalName, uint256 _price, string memory _ipfsHash) public {
        require(!recordList[msg.sender].isValue);
        recordList[msg.sender] = Record(msg.sender, _name, _date, _hospitalName, _price, _ipfsHash, false, false, true);
        hospitals[_hospitalName].patientAddrList.push(msg.sender);
        recordCount++;
        emit recordCreated(msg.sender, _name, _date, _hospitalName, _price, _ipfsHash);
    }

    function getPatientList(string memory _hospitalName) public view returns(Record[] memory) {
        address[] memory list = hospitals[_hospitalName].patientAddrList;
        Record[] memory records = new Record[](list.length);
        for(uint256 i=0; i<list.length; i++){
            records[i] = recordList[list[i]];
        }
        return records;
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
