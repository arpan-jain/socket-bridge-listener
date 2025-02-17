export const socketBridgeContract = {
  address: '0x3a23F943181408EAC424116Af7b7790c94Cb97a5',
  abi: [
    {
      inputs: [
        { internalType: 'address', name: '_owner', type: 'address' },
        { internalType: 'address', name: '_disabledRoute', type: 'address' },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    { inputs: [], name: 'ArrayLengthMismatch', type: 'error' },
    { inputs: [], name: 'IncorrectBridgeRatios', type: 'error' },
    { inputs: [], name: 'OnlyNominee', type: 'error' },
    { inputs: [], name: 'OnlyOwner', type: 'error' },
    { inputs: [], name: 'ZeroAddressNotAllowed', type: 'error' },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'uint32',
          name: 'controllerId',
          type: 'uint32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'controllerAddress',
          type: 'address',
        },
      ],
      name: 'ControllerAdded',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'uint32',
          name: 'controllerId',
          type: 'uint32',
        },
      ],
      name: 'ControllerDisabled',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'uint32',
          name: 'routeId',
          type: 'uint32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'route',
          type: 'address',
        },
      ],
      name: 'NewRouteAdded',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'claimer',
          type: 'address',
        },
      ],
      name: 'OwnerClaimed',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'nominee',
          type: 'address',
        },
      ],
      name: 'OwnerNominated',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: '_from',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: '_to',
          type: 'address',
        },
      ],
      name: 'OwnershipTransferRequested',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'uint32',
          name: 'routeId',
          type: 'uint32',
        },
      ],
      name: 'RouteDisabled',
      type: 'event',
    },
    { stateMutability: 'payable', type: 'fallback' },
    {
      inputs: [],
      name: 'BRIDGE_AFTER_SWAP_SELECTOR',
      outputs: [{ internalType: 'bytes4', name: '', type: 'bytes4' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'CENT_PERCENT',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'controllerAddress', type: 'address' },
      ],
      name: 'addController',
      outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'routeAddress', type: 'address' },
      ],
      name: 'addRoute',
      outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint32', name: 'routeId', type: 'uint32' }],
      name: 'addressAt',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'claimOwner',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'controllerCount',
      outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
      name: 'controllers',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'uint32', name: 'controllerId', type: 'uint32' },
      ],
      name: 'disableController',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint32', name: 'routeId', type: 'uint32' }],
      name: 'disableRoute',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'disabledRouteAddress',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          components: [
            { internalType: 'uint32', name: 'controllerId', type: 'uint32' },
            { internalType: 'bytes', name: 'data', type: 'bytes' },
          ],
          internalType: 'struct ISocketGateway.SocketControllerRequest',
          name: 'socketControllerRequest',
          type: 'tuple',
        },
      ],
      name: 'executeController',
      outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        {
          components: [
            { internalType: 'uint32', name: 'controllerId', type: 'uint32' },
            { internalType: 'bytes', name: 'data', type: 'bytes' },
          ],
          internalType: 'struct ISocketGateway.SocketControllerRequest[]',
          name: 'controllerRequests',
          type: 'tuple[]',
        },
      ],
      name: 'executeControllers',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'uint32', name: 'routeId', type: 'uint32' },
        { internalType: 'bytes', name: 'routeData', type: 'bytes' },
      ],
      name: 'executeRoute',
      outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'uint32[]', name: 'routeIds', type: 'uint32[]' },
        { internalType: 'bytes[]', name: 'dataItems', type: 'bytes[]' },
      ],
      name: 'executeRoutes',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'uint32', name: 'controllerId', type: 'uint32' },
      ],
      name: 'getController',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint32', name: 'routeId', type: 'uint32' }],
      name: 'getRoute',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: 'nominee_', type: 'address' }],
      name: 'nominateOwner',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'nominee',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'owner',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address payable',
          name: 'userAddress',
          type: 'address',
        },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'rescueEther',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'token', type: 'address' },
        { internalType: 'address', name: 'userAddress', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'rescueFunds',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
      name: 'routes',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'routesCount',
      outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address[]',
          name: 'routeAddresses',
          type: 'address[]',
        },
        {
          internalType: 'address[]',
          name: 'tokenAddresses',
          type: 'address[]',
        },
        { internalType: 'bool', name: 'isMax', type: 'bool' },
      ],
      name: 'setApprovalForRouters',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          components: [
            { internalType: 'uint32', name: 'swapRouteId', type: 'uint32' },
            { internalType: 'bytes', name: 'swapImplData', type: 'bytes' },
            {
              internalType: 'uint32[]',
              name: 'bridgeRouteIds',
              type: 'uint32[]',
            },
            {
              internalType: 'bytes[]',
              name: 'bridgeImplDataItems',
              type: 'bytes[]',
            },
            {
              internalType: 'uint256[]',
              name: 'bridgeRatios',
              type: 'uint256[]',
            },
            {
              internalType: 'bytes[]',
              name: 'eventDataItems',
              type: 'bytes[]',
            },
          ],
          internalType: 'struct ISocketRequest.SwapMultiBridgeRequest',
          name: 'swapMultiBridgeRequest',
          type: 'tuple',
        },
      ],
      name: 'swapAndMultiBridge',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    { stateMutability: 'payable', type: 'receive' },
  ],
};

export const socketBridgeEvent =
  'event SocketBridge(uint256 amount, address token, uint256 toChainId, bytes32 bridgeName, address sender, address receiver, bytes32 metadata)';

export const erc20Abi = [
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
];
