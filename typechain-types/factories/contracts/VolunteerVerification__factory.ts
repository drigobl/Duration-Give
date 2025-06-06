/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common";
import type {
  VolunteerVerification,
  VolunteerVerificationInterface,
} from "../../contracts/VolunteerVerification";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "charity",
        type: "address",
      },
    ],
    name: "CharityNotActive",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "charity",
        type: "address",
      },
    ],
    name: "CharityNotRegistered",
    type: "error",
  },
  {
    inputs: [],
    name: "EnforcedPause",
    type: "error",
  },
  {
    inputs: [],
    name: "ExpectedPause",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "hash",
        type: "bytes32",
      },
    ],
    name: "HashAlreadyVerified",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidHash",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "Unauthorized",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "applicationHash",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "applicant",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "charity",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "ApplicationVerified",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "charity",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "CharityRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "charity",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
    ],
    name: "CharityStatusUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "timeWorkedHash",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "volunteer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "charity",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalHours",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "TimeWorkedVerified",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "applications",
    outputs: [
      {
        internalType: "bytes32",
        name: "applicationHash",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "applicant",
        type: "address",
      },
      {
        internalType: "address",
        name: "charity",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isVerified",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "charities",
    outputs: [
      {
        internalType: "bool",
        name: "isRegistered",
        type: "bool",
      },
      {
        internalType: "address payable",
        name: "walletAddress",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_applicationHash",
        type: "bytes32",
      },
    ],
    name: "checkApplicationVerification",
    outputs: [
      {
        internalType: "bool",
        name: "isVerified",
        type: "bool",
      },
      {
        internalType: "address",
        name: "applicant",
        type: "address",
      },
      {
        internalType: "address",
        name: "charity",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_timeWorkedHash",
        type: "bytes32",
      },
    ],
    name: "checkTimeWorkedVerification",
    outputs: [
      {
        internalType: "bool",
        name: "isVerified",
        type: "bool",
      },
      {
        internalType: "address",
        name: "volunteer",
        type: "address",
      },
      {
        internalType: "address",
        name: "charity",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "totaltimeWorked",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "_charityAddress",
        type: "address",
      },
    ],
    name: "registerCharity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_charityAddress",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_isActive",
        type: "bool",
      },
    ],
    name: "updateCharityStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_applicationHash",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_applicant",
        type: "address",
      },
    ],
    name: "verifyApplication",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_timeWorkedHash",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_volunteer",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_timeWorked",
        type: "uint256",
      },
    ],
    name: "verifyTimeWorked",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "volunteerHours",
    outputs: [
      {
        internalType: "bytes32",
        name: "timeWorkedHash",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "volunteer",
        type: "address",
      },
      {
        internalType: "address",
        name: "charity",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "totalHours",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isVerified",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50338061003757604051631e4fbdf760e01b81526000600482015260240160405180910390fd5b6100408161004a565b506001805561009a565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b610e38806100a96000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c80635c975abb116100975780638da5cb5b116100665780638da5cb5b14610392578063ba7390be146103ad578063e0513a56146103c0578063f2fde38b1461046657600080fd5b80635c975abb146102de578063715018a6146102f45780637f377cc2146102fc5780638456cb591461038a57600080fd5b80633f4ba83a116100d35780633f4ba83a1461018c5780634994132b146101945780634cafa121146101a75780635ae010f01461022957600080fd5b80630dbf8da1146100fa578063217ab7aa1461010f5780632478239a14610122575b600080fd5b61010d610108366004610d2a565b610479565b005b61010d61011d366004610d4e565b6105f8565b610160610130366004610d2a565b60036020526000908152604090205460ff808216916001600160a01b0361010082041691600160a81b9091041683565b6040805193151584526001600160a01b0390921660208401521515908201526060015b60405180910390f35b61010d6107f1565b61010d6101a2366004610d7e565b610803565b6101f36101b5366004610db1565b60046020819052600091825260409091208054600182015460028301546003840154939094015491936001600160a01b039182169391169160ff1685565b604080519586526001600160a01b039485166020870152929093169184019190915260608301521515608082015260a001610183565b6102a8610237366004610db1565b600090815260056020818152604092839020835160c0810185528154815260018201546001600160a01b03908116938201849052600283015416948101859052600382015460608201819052600483015460808301819052929094015460ff16151560a09091018190529491939291565b6040805195151586526001600160a01b03948516602087015292909316918401919091526060830152608082015260a001610183565b60025460ff166040519015158152602001610183565b61010d6108be565b61034f61030a366004610db1565b600560208190526000918252604090912080546001820154600283015460038401546004850154949095015492946001600160a01b0392831694919092169260ff1686565b604080519687526001600160a01b039586166020880152939094169285019290925260608401526080830152151560a082015260c001610183565b61010d6108d0565b6000546040516001600160a01b039091168152602001610183565b61010d6103bb366004610dca565b6108e0565b6104346103ce366004610db1565b600090815260046020818152604092839020835160a0810185528154815260018201546001600160a01b03908116938201849052600283015416948101859052600382015460608201819052919093015460ff1615156080909301839052919390929190565b604051610183949392919093151584526001600160a01b03928316602085015291166040830152606082015260800190565b61010d610474366004610d2a565b610b5a565b610481610b98565b6001600160a01b0381166104dc5760405162461bcd60e51b815260206004820152601760248201527f496e76616c69642063686172697479206164647265737300000000000000000060448201526064015b60405180910390fd5b6001600160a01b03811660009081526003602052604090205460ff16156105455760405162461bcd60e51b815260206004820152601a60248201527f4368617269747920616c7265616479207265676973746572656400000000000060448201526064016104d3565b6040805160608101825260018082526001600160a01b03848116602080850182815285870194855260008381526003835287902095518654915195516001600160a81b0319909216901515610100600160a81b0319161761010095909416949094029290921760ff60a81b1916600160a81b931515939093029290921790925591514281527f3b047b355e75d32ac376195c35a37d1718e9e532f344bc9e39a655f21ea37d77910160405180910390a250565b610600610bc5565b610608610bef565b6001600160a01b03811661065e5760405162461bcd60e51b815260206004820152601960248201527f496e76616c6964206170706c6963616e7420616464726573730000000000000060448201526064016104d3565b3360009081526003602052604090205460ff166106905760405163f5bf2ccd60e01b81523360048201526024016104d3565b33600090815260036020526040902054600160a81b900460ff166106c95760405163aaa4c46960e01b81523360048201526024016104d3565b816106e6576040516257c03760e51b815260040160405180910390fd5b6000828152600460208190526040909120015460ff161561071d57604051630cb564a760e11b8152600481018390526024016104d3565b6040805160a0810182528381526001600160a01b038381166020808401828152338587018181524260608801818152600160808a0181815260008e81526004808a52908d90209b518c559651918b018054928b166001600160a01b0319938416179055935160028b01805491909a16911617909755955160038801555195909101805495151560ff19909616959095179094559351918252919285917fa7df89cedf3770c914ae5910e9d4ef643d574bde5755c3f53f84851542a38f38910160405180910390a46107ed60018055565b5050565b6107f9610b98565b610801610c13565b565b61080b610b98565b6001600160a01b03821660009081526003602052604090205460ff1661084f5760405163f5bf2ccd60e01b81526001600160a01b03831660048201526024016104d3565b6001600160a01b038216600081815260036020526040908190208054841515600160a81b0260ff60a81b19909116179055517f3b39c732bde88ff1cec0b0ab60065850daba2e831cd3175e3d86a1d4007ca542906108b290841515815260200190565b60405180910390a25050565b6108c6610b98565b6108016000610c65565b6108d8610b98565b610801610cb5565b6108e8610bc5565b6108f0610bef565b6001600160a01b0382166109465760405162461bcd60e51b815260206004820152601960248201527f496e76616c696420766f6c756e7465657220616464726573730000000000000060448201526064016104d3565b3360009081526003602052604090205460ff166109785760405163f5bf2ccd60e01b81523360048201526024016104d3565b33600090815260036020526040902054600160a81b900460ff166109b15760405163aaa4c46960e01b81523360048201526024016104d3565b826109ce576040516257c03760e51b815260040160405180910390fd5b6000838152600560208190526040909120015460ff1615610a0557604051630cb564a760e11b8152600481018490526024016104d3565b6040518060c00160405280848152602001836001600160a01b03168152602001336001600160a01b0316815260200182815260200142815260200160011515815250600560008581526020019081526020016000206000820151816000015560208201518160010160006101000a8154816001600160a01b0302191690836001600160a01b0316021790555060408201518160020160006101000a8154816001600160a01b0302191690836001600160a01b03160217905550606082015181600301556080820151816004015560a08201518160050160006101000a81548160ff021916908315150217905550905050336001600160a01b0316826001600160a01b0316847f33255cb2e6fcbac925bab395122311628aa6454f023a023ed315bb43c84fc4368442604051610b44929190918252602082015260400190565b60405180910390a4610b5560018055565b505050565b610b62610b98565b6001600160a01b038116610b8c57604051631e4fbdf760e01b8152600060048201526024016104d3565b610b9581610c65565b50565b6000546001600160a01b031633146108015760405163118cdaa760e01b81523360048201526024016104d3565b600260015403610be857604051633ee5aeb560e01b815260040160405180910390fd5b6002600155565b60025460ff16156108015760405163d93c066560e01b815260040160405180910390fd5b610c1b610cf2565b6002805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b610cbd610bef565b6002805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258610c483390565b60025460ff1661080157604051638dfc202b60e01b815260040160405180910390fd5b6001600160a01b0381168114610b9557600080fd5b600060208284031215610d3c57600080fd5b8135610d4781610d15565b9392505050565b60008060408385031215610d6157600080fd5b823591506020830135610d7381610d15565b809150509250929050565b60008060408385031215610d9157600080fd5b8235610d9c81610d15565b915060208301358015158114610d7357600080fd5b600060208284031215610dc357600080fd5b5035919050565b600080600060608486031215610ddf57600080fd5b833592506020840135610df181610d15565b92959294505050604091909101359056fea2646970667358221220b0e99e659f8b9272d3b9b4ce3bad6d0c62bb89a0d21602166b5ae686138f178764736f6c63430008180033";

type VolunteerVerificationConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: VolunteerVerificationConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class VolunteerVerification__factory extends ContractFactory {
  constructor(...args: VolunteerVerificationConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      VolunteerVerification & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): VolunteerVerification__factory {
    return super.connect(runner) as VolunteerVerification__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): VolunteerVerificationInterface {
    return new Interface(_abi) as VolunteerVerificationInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): VolunteerVerification {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as VolunteerVerification;
  }
}
