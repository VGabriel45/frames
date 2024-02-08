# frames

A simple example of using a Frame to deploy a Biconomy Smart Account and mint an NFT.

The transaction to mint an NFT is payed by a Paymaster.

The Smart Contract Wallet is owned by a private key which is generated for each user, each time you load the Frame you will receive a new private key. 

The private key is shared with the Frame user only but giving that it is shared in a search parameter it is not considered safe. However, this private key is just for a test EOA which should not be used on the mainnet.