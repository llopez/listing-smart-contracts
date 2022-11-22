import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Listing } from "../typechain-types";

describe("Listing", () => {
  let _listing: Listing;
  let _owner: SignerWithAddress;
  let _otherAccount: SignerWithAddress;

  const deployContract = async () => {
    const [owner, otherAccount] = await ethers.getSigners();

    const Listing = await ethers.getContractFactory("Listing");
    const listing = await Listing.deploy();

    return { listing, owner, otherAccount };
  };

  beforeEach(async () => {
    const { listing, owner, otherAccount } = await deployContract();
    _listing = listing;
    _owner = owner;
    _otherAccount = otherAccount;
  });

  describe("addItem", () => {
    let _title: string;

    beforeEach(async () => {
      _title = "This is the title";

      await _listing.addItem(_title);
    });

    it("updates items quantity (qty)", async () => {
      expect(await _listing.qty()).to.be.eq(1);
    });

    it("sets item attributes title and votes", async () => {
      const [_title, _votes] = await _listing.items(0);
      expect(_title).to.be.eq(_title);
      expect(_votes).to.be.eq(0);
    });

    it("sets authorOf to message sender", async () => {
      const author = await _listing.authorOf(0);
      expect(author).to.be.equal(_owner.address);
    });
  });

  describe("removeItem", () => {
    const id = ethers.BigNumber.from(0);

    beforeEach(async () => {
      await _listing.addItem("Item 1");
    });

    describe("when sender is the author", () => {
      describe("and already voted", () => {
        beforeEach(async () => {
          await _listing.connect(_otherAccount).voteItem(id);
        });

        it("fails with message", async () => {
          await expect(_listing.removeItem(id)).to.be.revertedWith(
            "already voted"
          );
        });
      });

      describe("and not yet voted", () => {
        it("decreses qty by 1", async () => {
          const qtyBefore = await _listing.qty();
          await _listing.removeItem(id);
          expect(await _listing.qty()).to.be.eq(qtyBefore.sub(1));
        });

        it("removes item from array", async () => {
          await _listing.removeItem(id);
          await expect(_listing.items(id)).to.be.revertedWithoutReason();
        });
      });
    });

    describe("when sender is not the author", () => {
      it("fails with message", async () => {
        await expect(
          _listing.connect(_otherAccount).removeItem(id)
        ).to.be.revertedWith("only author allowed");
      });
    });
  });

  describe("voteItem", () => {
    const id = ethers.BigNumber.from(0);

    beforeEach(async () => {
      await _listing.addItem("Item 1");
    });

    describe("when sender is the author", () => {
      it("fails with message", async () => {
        await expect(_listing.voteItem(id)).to.be.revertedWith(
          "author not allowed"
        );
      });
    });

    describe("when sender is not the author", () => {
      describe("and sender first time voting item", () => {
        it("increses item votes by 1", async () => {
          const [, votesBefore] = await _listing.items(id);
          await _listing.connect(_otherAccount).voteItem(id);
          const [, _votes] = await _listing.items(id);
          expect(_votes).to.be.eq(votesBefore.add(1));
        });

        it("updates votedBy", async () => {
          await _listing.connect(_otherAccount).voteItem(id);
          const votedBy = await _listing.votedBy(id, _otherAccount.address);
          expect(votedBy).to.be.true;
        });
      });

      describe("and sender already voted item", () => {
        beforeEach(async () => {
          await _listing.connect(_otherAccount).voteItem(id);
        });

        it("fails with message", async () => {
          await expect(
            _listing.connect(_otherAccount).voteItem(id)
          ).to.be.revertedWith("already voted by user");
        });
      });
    });
  });
});
