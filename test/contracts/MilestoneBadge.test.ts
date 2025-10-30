import { expect } from "chai";
import { ethers } from "hardhat";
import { MilestoneBadge } from "../../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("MilestoneBadge", function () {
  let milestoneBadge: MilestoneBadge;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  const baseURI = "https://academy.celo.org/api/metadata/milestone/";
  const tokenId1 = 1;
  const tokenId2 = 2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const MilestoneBadgeFactory = await ethers.getContractFactory("MilestoneBadge");
    milestoneBadge = await MilestoneBadgeFactory.deploy(baseURI);
    await milestoneBadge.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct base URI", async function () {
      expect(await milestoneBadge.uri(tokenId1)).to.equal(baseURI);
    });

    it("Should set the deployer as owner", async function () {
      expect(await milestoneBadge.owner()).to.equal(owner.address);
    });
  });

  describe("Claiming Badges", function () {
    it("Should allow users to claim badges", async function () {
      await expect(milestoneBadge.connect(user1).claim(tokenId1))
        .to.emit(milestoneBadge, "TransferSingle")
        .withArgs(user1.address, ethers.ZeroAddress, user1.address, tokenId1, 1);

      expect(await milestoneBadge.balanceOf(user1.address, tokenId1)).to.equal(1);
      expect(await milestoneBadge.claimed(user1.address, tokenId1)).to.equal(true);
    });

    it("Should prevent double claiming", async function () {
      await milestoneBadge.connect(user1).claim(tokenId1);
      
      await expect(
        milestoneBadge.connect(user1).claim(tokenId1)
      ).to.be.revertedWith("Already claimed");
    });

    it("Should allow claiming different token IDs", async function () {
      await milestoneBadge.connect(user1).claim(tokenId1);
      await milestoneBadge.connect(user1).claim(tokenId2);

      expect(await milestoneBadge.balanceOf(user1.address, tokenId1)).to.equal(1);
      expect(await milestoneBadge.balanceOf(user1.address, tokenId2)).to.equal(1);
    });

    it("Should allow different users to claim same token ID", async function () {
      await milestoneBadge.connect(user1).claim(tokenId1);
      await milestoneBadge.connect(user2).claim(tokenId1);

      expect(await milestoneBadge.balanceOf(user1.address, tokenId1)).to.equal(1);
      expect(await milestoneBadge.balanceOf(user2.address, tokenId1)).to.equal(1);
    });
  });

  describe("URI and Metadata", function () {
    it("Should return correct URI for any token ID", async function () {
      expect(await milestoneBadge.uri(tokenId1)).to.equal(baseURI);
      expect(await milestoneBadge.uri(999)).to.equal(baseURI);
    });
  });

  describe("Claimed Status", function () {
    it("Should track claimed status correctly", async function () {
      expect(await milestoneBadge.claimed(user1.address, tokenId1)).to.equal(false);
      
      await milestoneBadge.connect(user1).claim(tokenId1);
      
      expect(await milestoneBadge.claimed(user1.address, tokenId1)).to.equal(true);
      expect(await milestoneBadge.claimed(user1.address, tokenId2)).to.equal(false);
      expect(await milestoneBadge.claimed(user2.address, tokenId1)).to.equal(false);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle token ID 0", async function () {
      await milestoneBadge.connect(user1).claim(0);
      expect(await milestoneBadge.balanceOf(user1.address, 0)).to.equal(1);
    });

    it("Should handle large token IDs", async function () {
      const largeTokenId = ethers.MaxUint256;
      await milestoneBadge.connect(user1).claim(largeTokenId);
      expect(await milestoneBadge.balanceOf(user1.address, largeTokenId)).to.equal(1);
    });
  });

  describe("Gas Usage", function () {
    it("Should have reasonable gas costs for claiming", async function () {
      const tx = await milestoneBadge.connect(user1).claim(tokenId1);
      const receipt = await tx.wait();
      
      // Gas usage should be reasonable (adjust threshold as needed)
      expect(receipt!.gasUsed).to.be.lessThan(100000);
    });
  });
});