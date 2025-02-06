// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    address public owner;
    uint public productId;
    
    enum SupplyChainState { Created, Paid, Delivered }
    SupplyChainState public currentState;
    
    struct Product {
        string name;
        uint quantity;
        address producer;
        address retailer;
    }
    
    mapping(uint => Product) public products;

    event ProductCreated(uint productId, string name, uint quantity, address producer, address retailer);
    event StateChanged(uint productId, SupplyChainState newState);
    event QuantityUpdated(uint productId, uint newQuantity);
    event OwnershipTransferred(address newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier inState(SupplyChainState state) {
        require(currentState == state, "Invalid state for this operation");
        _;
    }

    modifier validProduct(uint _productId) {
        require(products[_productId].producer != address(0), "Product does not exist");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createProduct(string memory _name, uint _quantity, address _producer, address _retailer) public onlyOwner {
        productId++;
        products[productId] = Product({
            name: _name,
            quantity: _quantity,
            producer: _producer,
            retailer: _retailer
        });
        
        currentState = SupplyChainState.Created;
        
        emit ProductCreated(productId, _name, _quantity, _producer, _retailer);
    }

    function changeState(uint _productId, SupplyChainState _newState) public onlyOwner validProduct(_productId) {
        currentState = _newState;
        emit StateChanged(_productId, _newState);
    }

    function updateQuantity(uint _productId, uint _newQuantity) public onlyOwner validProduct(_productId) {
        products[_productId].quantity = _newQuantity;
        emit QuantityUpdated(_productId, _newQuantity);
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        owner = _newOwner;
        emit OwnershipTransferred(_newOwner);
    }

    function getProductDetails(uint _productId) public view returns (string memory, uint, address, address) {
        Product storage product = products[_productId];
        return (product.name, product.quantity, product.producer, product.retailer);
    }
}