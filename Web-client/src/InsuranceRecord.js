import web3 from './web3';

const address = "0x1423aCC020E3dCFFfd32A296C38ae4190c4D77Ad";

const abi =[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_patientAddr",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "statement",
				"type": "string"
			},
			{
				"internalType": "string[]",
				"name": "new_fileName",
				"type": "string[]"
			},
			{
				"internalType": "string[]",
				"name": "new_ipfsHashList",
				"type": "string[]"
			}
		],
		"name": "addNewDoc",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_patientAddr",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_hospitalAddr",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_policyname",
				"type": "string"
			},
			{
				"internalType": "string[]",
				"name": "_fileName",
				"type": "string[]"
			},
			{
				"internalType": "string[]",
				"name": "_ipfsHashList",
				"type": "string[]"
			},
			{
				"internalType": "string",
				"name": "_date",
				"type": "string"
			}
		],
		"name": "claimPolicy",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_hospitalName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_password",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_hospitalAddr",
				"type": "address"
			}
		],
		"name": "registerHospital",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_patientAddr",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_pName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_username",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_password",
				"type": "string"
			}
		],
		"name": "registerPatient",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_patientAddr",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "statement",
				"type": "string"
			}
		],
		"name": "requestDoc",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_policyID",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_policyname",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_patientAddr",
				"type": "address"
			}
		],
		"name": "selectPolicy",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_patientAddr",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "Addr",
				"type": "address"
			}
		],
		"name": "signClaim",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferMoney",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "claimCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "claimList",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "claims",
		"outputs": [
			{
				"internalType": "address",
				"name": "patientAddr",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "hospitalAddr",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "policyname",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "statusLine",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "signatureCount",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "date",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isValue",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_patientAddr",
				"type": "address"
			}
		],
		"name": "getClaimDetails",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "patientAddr",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "hospitalAddr",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "policyname",
						"type": "string"
					},
					{
						"internalType": "string[]",
						"name": "fileName",
						"type": "string[]"
					},
					{
						"internalType": "string[]",
						"name": "ipfsHashList",
						"type": "string[]"
					},
					{
						"internalType": "string",
						"name": "statusLine",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "signatureCount",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "date",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "isValue",
						"type": "bool"
					}
				],
				"internalType": "struct InsuranceRecord.Claim",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_hospitalAddr",
				"type": "address"
			}
		],
		"name": "getHClaimList",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getHospitalList",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_hospitalAddr",
				"type": "address"
			}
		],
		"name": "getHospitals",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "hospitalAddr",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "password",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "hospitalName",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "isValue",
						"type": "bool"
					},
					{
						"internalType": "address[]",
						"name": "patientAddrList",
						"type": "address[]"
					}
				],
				"internalType": "struct InsuranceRecord.Hospital",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getIClaimList",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_patientAddr",
				"type": "address"
			}
		],
		"name": "getPatients",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "patientAddr",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "username",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "pName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "password",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "policyname",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "isValue",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "policyID",
						"type": "uint256"
					},
					{
						"internalType": "uint32",
						"name": "policyStat",
						"type": "uint32"
					}
				],
				"internalType": "struct InsuranceRecord.Patient",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPolicyList",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "hospitalCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "hospitalList",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "hospitals",
		"outputs": [
			{
				"internalType": "address",
				"name": "hospitalAddr",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "password",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "hospitalName",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isValue",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_hospitalName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_password",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_hospitalAddr",
				"type": "address"
			}
		],
		"name": "loginHospital",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_username",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_password",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_patientAddr",
				"type": "address"
			}
		],
		"name": "loginPatient",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "patients",
		"outputs": [
			{
				"internalType": "address",
				"name": "patientAddr",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "username",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "pName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "password",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "policyname",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isValue",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "policyID",
				"type": "uint256"
			},
			{
				"internalType": "uint32",
				"name": "policyStat",
				"type": "uint32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
export default new web3.eth.Contract(abi, address);
