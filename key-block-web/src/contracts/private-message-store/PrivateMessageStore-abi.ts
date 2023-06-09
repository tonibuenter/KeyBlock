export const privateMessageStoreAbi = [
  {
    inputs: [],
    name: 'MAX_LENGTH_SUBJECT',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'MAX_LENGTH_TEXT',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_receiver',
        type: 'address'
      },
      {
        internalType: 'string',
        name: '_subjectInBox',
        type: 'string'
      },
      {
        internalType: 'string',
        name: '_textInBox',
        type: 'string'
      },
      {
        internalType: 'string',
        name: '_subjectOutBox',
        type: 'string'
      },
      {
        internalType: 'string',
        name: '_textOutBox',
        type: 'string'
      },
      {
        internalType: 'bytes32',
        name: '_contentHash',
        type: 'bytes32'
      }
    ],
    name: 'send',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_receiver',
        type: 'address'
      },
      {
        internalType: 'string',
        name: '_subjectInBox',
        type: 'string'
      },
      {
        internalType: 'string',
        name: '_textInBox',
        type: 'string'
      },
      {
        internalType: 'string',
        name: '_subjectOutBox',
        type: 'string'
      },
      {
        internalType: 'string',
        name: '_textOutBox',
        type: 'string'
      },
      {
        internalType: 'bytes32',
        name: '_contentHash',
        type: 'bytes32'
      },
      {
        internalType: 'uint256',
        name: '_replyIndex',
        type: 'uint256'
      }
    ],
    name: 'reply',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'lenInBox',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'lenOutBox',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_index',
        type: 'uint256'
      }
    ],
    name: 'getInBox',
    outputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'indexOutBox',
        type: 'uint256'
      },
      {
        internalType: 'string',
        name: 'subjectInBox',
        type: 'string'
      },
      {
        internalType: 'string',
        name: 'textInBox',
        type: 'string'
      },
      {
        internalType: 'uint256',
        name: 'inserted',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'confirmedTime',
        type: 'uint256'
      },
      {
        internalType: 'bool',
        name: 'confirmed',
        type: 'bool'
      },
      {
        internalType: 'bool',
        name: 'hasReply',
        type: 'bool'
      },
      {
        internalType: 'uint256',
        name: 'replyIndex',
        type: 'uint256'
      },
      {
        internalType: 'bytes32',
        name: 'contentHash',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_index',
        type: 'uint256'
      }
    ],
    name: 'getOutBox',
    outputs: [
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'indexInBox',
        type: 'uint256'
      },
      {
        internalType: 'string',
        name: 'subjectOutBox',
        type: 'string'
      },
      {
        internalType: 'string',
        name: 'textOutBox',
        type: 'string'
      },
      {
        internalType: 'bytes32',
        name: 'contentHash',
        type: 'bytes32'
      },
      {
        internalType: 'uint256',
        name: 'inserted',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'confirmedTime',
        type: 'uint256'
      },
      {
        internalType: 'bool',
        name: 'confirmed',
        type: 'bool'
      },
      {
        internalType: 'bool',
        name: 'hasReply',
        type: 'bool'
      },
      {
        internalType: 'uint256',
        name: 'replyIndex',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_index',
        type: 'uint256'
      }
    ],
    name: 'confirm',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;
