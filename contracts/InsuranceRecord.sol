//SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

interface IWallet {
    receive() external payable;
    function transact(address,uint256) external payable;
    function checkBalance() external view returns(uint256);
}

contract InsuranceRecord {

    struct Claim {
        address patientAddr;
        address hospitalAddr;
        string policyname;
        string ipfsHash;
        uint256 signatureCount;
        string date;
        bool isValue;
    }

    // struct Documents {
    //     address patientAddr; //
    //     string[] ipfs; // 1,2,3,4,5
    //     string[] new_ipfs; // 6,7
    // }

    struct Hospital {
        address hospitalAddr; //Primary Key
        string password;
        string hospitalName;
        bool isValue;
        address[] patientAddrList;
    }

    struct Patient {
        address patientAddr; // Primary Key
        string username;
        string pName;
        string password;
        string policyname;
        bool isValue;
        uint256 policyID;
        uint32 policyStat; // 0=Not selected policy; 1=Selected but not cliamed; 2= Claimed 
    }

    struct Insurance {
        address ICAddr; // Primary Key
        string name;
        string username;
        string password;
        bool isValue;
        uint256[] policyList; // ID => amount
    }

    address payable private IWalletAddr;
    mapping(address => Patient) public patients;
    mapping(address => Hospital) public hospitals;
    mapping(address => Claim) public claims;
    mapping(uint256 => address) public hospitalList;
    uint256 public hospitalCount = 0;
    mapping(uint256 => address) public claimList;
    uint256 public claimCount = 0;
    Insurance IC;

    constructor() public {
        IC = Insurance(0xC3580Cb3E0252B3B5D0a360863e6AA5c63f4AC4b,"Claim-Chain","insurance","insurance",true,new uint256[](5));
        IC.policyList[0] = 1;
        IC.policyList[1] = 2;
        IC.policyList[2] = 3;
        IC.policyList[3] = 4;
        IC.policyList[4] = 5;
        IWalletAddr = payable(0x94F4fD2168AE4C5E79bEFC0F260f66a4e2ED906A); // Wallet Contract Address
    }

    function registerHospital(string memory _hospitalName, string memory _password, address _hospitalAddr) public {
        require(!hospitals[_hospitalAddr].isValue);
        Hospital memory h;
        h.hospitalAddr = _hospitalAddr;
        h.hospitalName = _hospitalName;
        h.password = _password;
        h.isValue = true;
        hospitals[_hospitalAddr] = h;
        hospitalList[hospitalCount++] = _hospitalAddr;
    }

    function checkData(string memory a, string memory b) internal pure returns (bool) {
        if(bytes(a).length != bytes(b).length) {
            return false;
        } else {
            return keccak256(abi.encode(a)) == keccak256(abi.encode(b));
        }
    }
    
    function loginHospital(string memory _hospitalName, string memory _password, address _hospitalAddr) public view returns(bool){
        Hospital memory h = hospitals[_hospitalAddr]; 
        if(h.isValue) {
            return checkData(h.hospitalName,_hospitalName)&&checkData(h.password,_password);
        } else {
            return false;
        }
    }

    function getHospitalList() public view returns(address[] memory,string[] memory) {
        address[] memory addrList = new address[](hospitalCount);
        string[] memory strList = new string[](hospitalCount);
        for(uint256 i=0; i<addrList.length; i++){
            addrList[i] = hospitalList[i];
            strList[i] = hospitals[addrList[i]].hospitalName;
        }
        return (addrList,strList);
    }

    function registerPatient(address _patientAddr, string memory _pName, string memory _username, string memory _password) public{
        require(!patients[_patientAddr].isValue);
        Patient memory p;
        p.patientAddr = _patientAddr;
        p.pName = _pName;
        p.username = _username;
        p.password = _password;
        p.policyname = '';
        p.isValue = true;
        p.policyStat = 0;
        patients[_patientAddr] = p;
        claimList[claimCount++] = _patientAddr;
    }

    function loginPatient(string memory _username, string memory _password, address _patientAddr) public view returns(bool) {
        Patient memory p = patients[_patientAddr];
        if(p.isValue) {
            return checkData(p.username,_username)&&checkData(p.password,_password);
        } else {
            return false;
        }
    }
    
    function getPatients(address _patientAddr) public view returns (Patient memory) {
    return patients[_patientAddr];
    }

    function getHospitals(address _hospitalAddr) public view returns (Hospital memory) {
    return hospitals[_hospitalAddr];
    }

    function getClaimDetails(address _patientAddr) public view returns (Claim memory) {
    return claims[_patientAddr];
    }

    function getPolicyList() public view returns(uint256[] memory) {
        return IC.policyList;
    }

    function selectPolicy(uint256 _policyID,string memory _policyname, address _patientAddr) public returns(bool){
        Patient storage p = patients[_patientAddr];
        if(p.policyStat == 0) {
            p.policyID = _policyID;
            p.policyname = _policyname;
            p.policyStat = 1;
            return true;
        } else {
            return false;
        }
    }

    function claimPolicy(address _patientAddr, address _hospitalAddr,string memory _policyname, string memory _ipfsHash, string memory _date) public{
        Patient storage p = patients[_patientAddr];
        require(p.isValue);
        require(p.policyStat == 1);
        p.policyStat = 2;
        claims[_patientAddr] = Claim(_patientAddr, _hospitalAddr,_policyname, _ipfsHash, 0, _date, true);
        hospitals[_hospitalAddr].patientAddrList.push(_patientAddr);
    }

    function getHClaimList(address _hospitalAddr) public view returns(address[] memory, string[] memory, string[] memory, uint256[] memory, string[] memory) {
        address[] memory pAlist = hospitals[_hospitalAddr].patientAddrList;
        string[] memory pNlist = new string[](pAlist.length);
        string[] memory ipfslist = new string[](pAlist.length);
        uint256[] memory amountList = new uint256[](pAlist.length);
        string[] memory datelist = new string[](pAlist.length);
        for(uint256 i=0; i<pAlist.length; i++){
            if(claims[pAlist[i]].signatureCount == 1) {
                continue;
            }
            pNlist[i] = patients[pAlist[i]].pName;
            ipfslist[i] = claims[pAlist[i]].ipfsHash;
            amountList[i] = IC.policyList[patients[pAlist[i]].policyID];
            datelist[i] = claims[pAlist[i]].date;
        }
        return (pAlist,pNlist,ipfslist,amountList,datelist);
    }

    function transferMoney(address sender, address receiver, uint256 amount) public{
        if(msg.sender == sender) {
            IWallet(IWalletAddr).transact(receiver,amount);
        }
    }

    function signClaim(address _patientAddr,address Addr) public returns(bool) {
        require(Addr!=address(0));
        require(Addr!=_patientAddr);
        Claim storage c = claims[_patientAddr];
        Patient memory p = patients[_patientAddr];
        Hospital memory h = hospitals[c.hospitalAddr];
        if(Addr==IC.ICAddr){
            require(c.signatureCount==1);
            c.signatureCount++;
            transferMoney(IC.ICAddr,p.patientAddr,IC.policyList[p.policyID]);
        } else if(Addr==h.hospitalAddr) {
            require(c.signatureCount==0);
            c.signatureCount++;
            return true;
        }
    }

    function getIClaimList() public view returns(address[] memory, string[] memory,string[] memory, string[] memory, uint256[] memory, uint256[] memory, string[] memory, string[] memory) {
        address[] memory pAlist = new address[](claimCount);
        string[] memory pNlist = new string[](pAlist.length);
        string[] memory ipfslist = new string[](pAlist.length);
        string[] memory policyname = new string[](pAlist.length);
        uint256[] memory SClist = new uint256[](pAlist.length);
        uint256[] memory amountList = new uint256[](pAlist.length);
        string[] memory datelist = new string[](pAlist.length);
        string[] memory hNlist = new string[](pAlist.length);
        for(uint256 i=0; i<claimCount; i++){
            if(patients[claimList[i]].policyStat != 2){
                continue;
            }
            pAlist[i] = claimList[i];
            pNlist[i] = patients[pAlist[i]].pName;
            policyname[i] = claims[pAlist[i]].policyname;
            ipfslist[i] = claims[pAlist[i]].ipfsHash;
            SClist[i] = claims[pAlist[i]].signatureCount;
            amountList[i] = IC.policyList[patients[pAlist[i]].policyID];
            datelist[i] = claims[pAlist[i]].date;
            hNlist[i] = hospitals[claims[pAlist[i]].hospitalAddr].hospitalName;
        }
        return (pAlist,pNlist,policyname,ipfslist,SClist,amountList,datelist,hNlist);
    }
}
