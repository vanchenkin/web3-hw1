import type { HardhatUserConfig } from "hardhat/config";
import "@openzeppelin/hardhat-upgrades";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-toolbox";

import { vars } from "hardhat/config";

const INFURA_API_KEY = vars.get("INFURA_API_KEY");
const SEPOLIA_PRIVATE_KEY = vars.get("SEPOLIA_PRIVATE_KEY");
const POLYGONSCAN_API_KEY = vars.get("POLYGONSCAN_API_KEY");
const AMOY_PRIVATE_KEY = vars.get("AMOY_PRIVATE_KEY");
const AMOY_PRIVATE_KEY2 = vars.get("AMOY_PRIVATE_KEY_SECOND");
const ETHERSCAN_API_KEY = vars.get("ETHERSCAN_API_KEY");

const config: HardhatUserConfig = {
    solidity: "0.8.27",
    networks: {
        sepolia: {
            chainId: 11155111,
            url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
            accounts: [SEPOLIA_PRIVATE_KEY],
            gas: "auto",
        },
        polygon_amoy: {
            url: "https://rpc-amoy.polygon.technology",
            accounts: [AMOY_PRIVATE_KEY2],
        },
    },
    etherscan: {
        apiKey: {
          polygonAmoy: POLYGONSCAN_API_KEY,
        },
        customChains: [
          {
            network: "polygonAmoy",
            chainId: 80002,
            urls: {
              apiURL: "https://api-amoy.polygonscan.com/api",
              browserURL: "https://amoy.polygonscan.com"
            },
          }
        ]
      }
};

export default config;
