const { expect } = require("chai");

describe("SupplyChain Contract", function () {
    let SupplyChain;
    let supplyChain;
    let owner;
    let producer;
    let retailer;

    beforeEach(async function () {
        SupplyChain = await ethers.getContractFactory("SupplyChain");
        [owner, producer, retailer] = await ethers.getSigners();
        supplyChain = await SupplyChain.deploy(); // Correctly await deployment
    });

    describe("Product Creation", function () {
        it("should create a product successfully", async function () {
            await supplyChain.createProduct("Product A", 100, producer.address, retailer.address);
            const productDetails = await supplyChain.getProductDetails(1);
            expect(productDetails[0]).to.equal("Product A");
            expect(productDetails[1]).to.equal(100);
            expect(productDetails[2]).to.equal(producer.address);
            expect(productDetails[3]).to.equal(retailer.address);
        });

        it("should increment productId for each product created", async function () {
            await supplyChain.createProduct("Product A", 100, producer.address, retailer.address);
            await supplyChain.createProduct("Product B", 50, producer.address, retailer.address);
            expect(await supplyChain.productId()).to.equal(2);
        });
    });

    describe("State Management", function () {
        it("should change product state successfully", async function () {
            await supplyChain.createProduct("Product A", 100, producer.address, retailer.address);
            await supplyChain.changeState(1, 1); // Change to Paid
            expect(await supplyChain.currentState()).to.equal(1); // State should be Paid
        });

        it("should revert if changing state of a non-existent product", async function () {
            await expect(supplyChain.changeState(999, 1)).to.be.revertedWith("Product does not exist");
        });
    });

    describe("Quantity Updates", function () {
        it("should update product quantity successfully", async function () {
            await supplyChain.createProduct("Product A", 100, producer.address, retailer.address);
            await supplyChain.updateQuantity(1, 80);
            const productDetails = await supplyChain.getProductDetails(1);
            expect(productDetails[1]).to.equal(80); // Quantity should be updated to 80
        });

        it("should revert if updating quantity of a non-existent product", async function () {
            await expect(supplyChain.updateQuantity(999, 80)).to.be.revertedWith("Product does not exist");
        });
    });

    describe("Ownership Management", function () {
        it("should transfer ownership successfully", async function () {
            await supplyChain.transferOwnership(producer.address);
            expect(await supplyChain.owner()).to.equal(producer.address);
        });

        it("should revert if non-owner tries to transfer ownership", async function () {
            await expect(supplyChain.connect(retailer).transferOwnership(retailer.address)).to.be.revertedWith("Only owner can call this function");
        });
    });
});