async function main() {
    // Get the contract factory for the SupplyChain contract
    const SupplyChain = await ethers.getContractFactory("SupplyChain");
    
    // Deploy the contract
    const supplyChain = await SupplyChain.deploy();
    
    // Wait for the deployment to be mined
    await supplyChain.waitForDeployment();

    // Log the contract address to the console
    console.log("SupplyChain deployed to:",await supplyChain.getAddress());
}

// Execute the main function
main()
    .then(() => process.exit(0)) // Exit the process if successful
    .catch((error) => { // Handle errors
        console.error(error);
        process.exit(1);
    });