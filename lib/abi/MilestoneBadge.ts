export const abi = [
  { "type":"function","name":"claim","stateMutability":"nonpayable","inputs":[{"name":"tokenId","type":"uint256"}],"outputs":[] },
  { "type":"function","name":"balanceOf","stateMutability":"view","inputs":[{"name":"account","type":"address"},{"name":"id","type":"uint256"}],"outputs":[{"type":"uint256"}]}
] as const;
