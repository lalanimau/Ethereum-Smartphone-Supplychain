pragma solidity ^0.4.24;
// Define a contract 'Supplychain'
import "../accesscontrols/ComponentManufacturerRole.sol";
import "../accesscontrols/SmartphoneMakerRole.sol";
import "../accesscontrols/RetailerRole.sol";
import "../accesscontrols/ConsumerRole.sol";
import "./Items.sol";

contract SupplyChain is ComponentManufacturerRole, SmartphoneMakerRole, RetailerRole, ConsumerRole {

  // Define 'owner'
    address private owner;

  // Define a variable called 'upc' for Universal Product Code (UPC)
    uint  upc;

    // Define a variable called 'sku' for Stock Keeping Unit (SKU)
    uint  sku;

    // Define a public mapping 'items' that maps the UPC to an Item.
    mapping (uint => Items.Item) items;
    
    // Define a public mapping 'itemsHistory' that maps the UPC to an array of TxHash, 
    // that track its journey through the supply chain -- to be sent from DApp.
    mapping (uint => string[]) itemsHistory;

    Items.State constant defaultState = Items.State.NoState;

    // Define 8 events with the same 8 state values and accept 'upc' as input argument
    event ComponentsManufactured(uint upc);
    event SmartphoneAssembled(uint upc);
    event ShippedToRetailer(uint upc);
    event ReceivedByRetailer(uint upc);
    event OnSale(uint upc);
    event Sold(uint upc);
    event ShippedToConsumer(uint upc);
    event ReceivedByConsumer(uint upc);

    // Define a modifer that checks to see if msg.sender == owner of the contract
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // Define a modifer that verifies the Caller
    modifier verifyCaller (address _address) {
        require(msg.sender == _address); 
        _;
    }

    // Define a modifier that checks if the paid amount is sufficient to cover the price
    modifier paidEnough(uint _price) { 
        require(msg.value >= _price); 
        _;
    }

    // Define a modifier that checks the price and refunds the remaining balance
    modifier checkValue(uint _upc) {
        _;
        uint _price = items[_upc].price;
        uint amountToReturn = msg.value - _price;
        items[_upc].consumerID.transfer(amountToReturn);
    }

    modifier canBuyItem(uint _upc) {
        uint _price = items[_upc].price;
        require(msg.value >= _price);
        _;
    }

    modifier componentsManufactured(uint _upc) {
        require(items[_upc].itemState == Items.State.ComponentsManufactured);
        _;
    }

    
    modifier smartphoneAssembled(uint _upc) {
        require(items[_upc].itemState == Items.State.SmartphoneAssembled);
        _;
    }


    modifier shippedToRetailer(uint _upc) {
        require(items[_upc].itemState == Items.State.ShippedToRetailer);
        _;
    }


    modifier receivedByRetailer(uint _upc) {
        require(items[_upc].itemState == Items.State.ReceivedByRetailer || items[_upc].itemState == Items.State.OnSale);
        _;
    }

    modifier onSale(uint _upc) {
        require(items[_upc].itemState == Items.State.OnSale);
        _;
    }

    modifier sold(uint _upc) {
        require(items[_upc].itemState == Items.State.Sold);
        _;
    }

    modifier shippedToConsumer(uint _upc) {
        require(items[_upc].itemState == Items.State.ShippedToConsumer);
        _;
    }

    modifier receivedByConsumer(uint _upc) {
        require(items[_upc].itemState == Items.State.ReceivedByConsumer);
        _;
    }
   

    // In the constructor set 'owner' to the address that instantiated the contract
    // and set 'sku' to 1
    // and set 'upc' to 1
    constructor() public payable {
        owner = msg.sender;
        sku = 1;
        upc = 1;
    }

    // Define a function 'kill' if required
    function kill() public {
        if (msg.sender == owner) {
            selfdestruct(owner);
        }
    }

    
    function getItemPrice(uint _upc) public view returns(uint price) {
        require(items[_upc].price > 0, "Item price is not greater than zero");
        return items[_upc].price;
    }

    function isItemOnSale(uint _upc) public view returns(bool) {
        return items[_upc].itemState == Items.State.OnSale;
    }
    
    function manufactureComponents(uint _upc, string  _notes, uint _price ) public onlyManufacturer() 
    {
        require(_upc!=0,"UPC can't be zero");
        require(items[_upc].upc != _upc, "Item already exists with the given upc");
        require(_price>0, "Price is not greater than zero");
        Items.Item memory i = Items.Item(
            sku,
            _upc,
            msg.sender,
            msg.sender,
            sku+upc,
            _notes,
            _price,
            Items.State.ComponentsManufactured,
            0,
            0,
            0
        );
        items[_upc] = i;
        // Increment sku
        sku = sku + 1;
        // Emit the appropriate event
        emit ComponentsManufactured(_upc);

    }

   
    function assembleSmartphone(uint _upc, uint assemblyCost) public componentsManufactured(_upc) onlySmartphoneMaker()

    {

        Items.Item storage i = items[_upc];
        require(i.smartphoneMakerID == 0, "Smartphone already assembled");
        require(assemblyCost > 0, "Assembly cost is not greater than zero");
        i.ownerID = msg.sender;
        i.price = i.price + assemblyCost;
        i.itemState = Items.State.SmartphoneAssembled;
        i.smartphoneMakerID = msg.sender;

        emit SmartphoneAssembled(_upc);
    }

    function retailerBuy(uint _upc) public payable canBuyItem(_upc) smartphoneAssembled(_upc) {
        
        Items.Item storage i = items[_upc];

        uint refundAmount = msg.value - i.price;
        i.smartphoneMakerID.transfer(i.price);
        msg.sender.transfer(refundAmount);
        i.ownerID = msg.sender;
        i.itemState = Items.State.ShippedToRetailer;
        i.retailerID = msg.sender;
        emit ShippedToRetailer(_upc);
    }

    function markReceivedByRetailer(uint _upc) public shippedToRetailer(_upc) {

        Items.Item storage i = items[_upc];
        require(i.ownerID == msg.sender,"Not the retailer of the given upc");
        i.itemState = Items.State.ReceivedByRetailer;

        emit ReceivedByRetailer(_upc);
    }

    function putForSale(uint _upc, uint price) public receivedByRetailer(_upc) {
        Items.Item storage i = items[_upc];
        require(i.ownerID == msg.sender,"Not the retailer of the given upc");
        i.itemState = Items.State.OnSale;
        i.price += price;
        emit OnSale(_upc);

    }
    

    function consumerBuy(uint _upc) public payable canBuyItem(_upc) onSale(_upc) {

        Items.Item storage i = items[_upc];

        uint refundAmount = msg.value - i.price;
        i.retailerID.transfer(i.price);
        msg.sender.transfer(refundAmount);
        i.ownerID = msg.sender;
        i.consumerID = msg.sender;
        i.itemState = Items.State.Sold;
        emit Sold(_upc);        
    }

    function shipToConsumer(uint _upc) public sold(_upc) {
        Items.Item storage i = items[_upc];
        require(i.retailerID == msg.sender, "Only the retailer of that smartphone can ship");

        i.itemState = Items.State.ShippedToConsumer;

        emit ShippedToConsumer(_upc);
    } 

    function markReceivedByConsumer(uint _upc) public shippedToConsumer(_upc) {
        Items.Item storage i = items[_upc];
        require(i.consumerID == msg.sender,"Consumer can mark smartphone received");

        i.itemState = Items.State.ReceivedByConsumer;

        emit ReceivedByConsumer(_upc);
    }

    function getItemInfo(uint _upc) public view returns
    (
        uint    iSku, 
        uint    iUpc,
        address ownerID,  // Metamask-Ethereum address of the current owner as the product moves through 8 stages
        address originID, // Metamask-Ethereum address of the Farmer
        uint    productID,  // Product ID potentially a combination of upc + sku
        string  productNotes, // Product Notes
        uint    price, // Product Price
        Items.State   itemState,  // Product State as represented in the enum above
        address smartphoneMakerID,
        address retailerID, // Metamask-Ethereum address of the Retailer
        address consumerID
    )
     {
        require(_upc!=0,"UPC can't be 0");
        Items.Item memory i = items[_upc];
        iSku = i.sku;
        iUpc = i.upc;
        ownerID = i.ownerID;
        originID = i.originID;
        productID = i.productID;
        productNotes = i.productNotes;
        price = i.price;
        itemState = i.itemState;
        smartphoneMakerID = i.smartphoneMakerID;
        retailerID = i.retailerID;
        consumerID = i.consumerID;

    }

}
