import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import hre from "hardhat";
import { expect } from "chai";

describe("Token contract", function () {
    async function deployTokenFixture() {
        const [owner, addr1, addr2] = await hre.ethers.getSigners();

        const hardhatToken = await hre.ethers.deployContract("VanERC20", [owner]);

        return { hardhatToken, owner, addr1, addr2 };
    }

    it("Buy tokens", async function () {
        const { hardhatToken, owner } = await loadFixture(deployTokenFixture);

        await expect(
            hardhatToken.buy({
                value: 300,
            })
        ).to.changeTokenBalance(hardhatToken, owner, 300);
    });

    it("Mint tokens", async function () {
        const { hardhatToken, owner } = await loadFixture(deployTokenFixture);

        await expect(hardhatToken.mint(owner, 100)).to.changeTokenBalance(hardhatToken, owner, 100);
    });

    it("Mint tokens not owner", async function () {
        const { hardhatToken, owner, addr1 } = await loadFixture(deployTokenFixture);

        await expect(hardhatToken.connect(addr1).mint(addr1, 100)).to.reverted;
    });

    it("Tax on transfer", async function () {
        const { hardhatToken, owner, addr1 } = await loadFixture(deployTokenFixture);

        hardhatToken.buy({
            value: 300,
        });

        await expect(hardhatToken.transfer(addr1, 300)).changeTokenBalances(
            hardhatToken,
            [owner, addr1],
            [-300, 300 * 0.95]
        );
    });

    it("Tax on transferFrom", async function () {
        const { hardhatToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);

        hardhatToken.connect(addr1).buy({
            value: 300,
        });

        await expect(hardhatToken.connect(addr1).approve(owner, 300));

        await expect(hardhatToken.transferFrom(addr1, addr2, 300)).changeTokenBalances(
            hardhatToken,
            [addr1, addr2],
            [-300, 300 * 0.95]
        );
    });

    it("Permit", async function () {
        const { hardhatToken, owner, addr1: spender } = await loadFixture(deployTokenFixture);

        const value = 100n;
        const deadline = Math.floor(Date.now() / 1000) + 7200;

        await hardhatToken.connect(owner).buy({
            value,
        });

        const { name, version, chainId, verifyingContract } = await hardhatToken.eip712Domain();

        const domain = {
            name,
            version,
            chainId,
            verifyingContract,
        };

        const types = {
            Permit: [
                {
                    name: "owner",
                    type: "address",
                },
                {
                    name: "spender",
                    type: "address",
                },
                {
                    name: "value",
                    type: "uint256",
                },
                {
                    name: "nonce",
                    type: "uint256",
                },
                {
                    name: "deadline",
                    type: "uint256",
                },
            ],
        };

        const nonce = await hardhatToken.nonces(owner.address);

        const values = {
            owner: owner.address,
            spender: spender.address,
            value: value,
            nonce: nonce,
            deadline: deadline,
        };

        const signature = await owner.signTypedData(domain, types, values);

        const sig = hre.ethers.Signature.from(signature);

        await hardhatToken
            .connect(spender)
            .permit(owner.address, spender.address, value, deadline, sig.v, sig.r, sig.s);

        await expect(await hardhatToken.allowance(owner, spender)).to.equal(value);

        await expect(hardhatToken.connect(spender).transferFrom(owner, spender, value)).changeTokenBalances(
            hardhatToken,
            [owner, spender],
            [-value, Number(value) * 0.95]
        );
    });
});
