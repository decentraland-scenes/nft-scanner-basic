# NFT Scanner (Basic)
_demo of nft-scanner-basic scene running in preview._

![demo](https://github.com/decentraland-scenes/nft-scanner-basic/blob/main/screenshots/nft-scanner-basic.gif)

## Description
Checks whether the player owns a token from a particular smart contract before granting them permission to enter the club. In this example, we're checking whether the player owns a pair of RTFKT X Atari Sneakers, which is any token minted from this [contract](https://etherscan.io/address/0x6b47e7066c7db71aa04a1d5872496fe05c4c331f).

> Note: There's another version of this scene [here](https://github.com/decentraland-scenes/nft-scanner) that performs more advanced token checks.

## Instructions
Walk up to the door and press the <kbd>E</kbd> key to see if you can access the club. The door will open and the audio quality increases if you own at least one pair of RTFKT X Atari Sneakers. Please feel free to modify the `contractAddress` within the `game.ts` file to test other tokens.

Use your mouse to look around and <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd><kbd>Space</kbd> keys on your keyboard to move forward, left, backward, right and jump respectively. You can also press the <kbd>P</kbd> key to adjust the graphics settings.

1- Change Contract Address
2- dcl start
3- add &ENABLE_WEB3 to URL
4- dcl deploy --skip-build


## Try it out

**Install the CLI**
Download and install the Decentraland CLI by running the following command:

```
$ npm i -g decentraland
$ npm install -g firebase-tools
```

**Previewing the scene**
Download this example and navigate to its directory, then run:

```
$  dcl start
```
Any dependencies are installed and then the CLI opens the scene in a new browser tab.

Add the following to the end of the URL in the browser window:

```
&ENABLE_WEB3
```
For example, if the URL is `http://192.168.1.132:8000?position=0%2C0&SCENE_DEBUG_PANEL` then change it to `http://192.168.1.132:8000?position=0%2C0&SCENE_DEBUG_PANEL&ENABLE_WEB3`

> Note: Make sure you have a browser wallet installed like Metamask or Fortmatic as you'll need to be logged onto those with the network set to the `Ethereum Mainnet` in order for the scene to perform checks on your wallet address.

**Setting up the server**

The scene is set up to make use of an existing server. To launch your own server, we recommend you deploy what's in the /server folder to your own Firebase account, following the steps in [this tutorial](https://decentraland.org/blog/tutorials/servers-part-2/).

***OR FOLLOW SERVER TUTORIAL file***

1- Create Firebase project
2- change database id from below files
        + server/.firebaseerc 
        + server/src/index.ts 
        + server/src/index.js
        + src/serverHandler.ts
        + game.ts
3- Create Firestone database
4- Set collection name with Signatures
5- In Project Settings/Service Accounts, Create service account and generate new private key and download it
6- Change server/functions/permissions.json file with new private key file
7- In server file run below commands
        + firebase login
        + npm run serve
        + firebase deploy






