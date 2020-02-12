const Core = artifacts.require('Core');


contract("Core", function (accounts) {

    let supplyChainCore;
    let defaultAccount = accounts[0];
    let basePrice = web3.utils.toWei('1', "ether")

    let smartphoneMaker = accounts[1];
    let retailer = accounts[2];
    let consumer = accounts[3];

    beforeEach(async () => {
        supplyChainCore = await Core.deployed();
    })

    it("SupplyChain core is setup", async () => {
        assert(supplyChainCore, "Core is deployed");
        assert.equal(await supplyChainCore.isSmartphoneMaker(smartphoneMaker), false, "should not have been smartphone maker");
        assert.equal(await supplyChainCore.isRetailer(retailer), false, "should not have been retailer");

        await supplyChainCore.addSmartphoneMaker(smartphoneMaker);
        await supplyChainCore.addRetailer(retailer);
        await supplyChainCore.addConsumer(consumer);

        assert.equal(await supplyChainCore.isSmartphoneMaker(smartphoneMaker), true, "should have been smartphone maker");
        assert.equal(await supplyChainCore.isRetailer(retailer), true, "should have been retailer");
    });

    it("Can manufacture the smartphone components", async () => {
        let eventEmitted = false;
        let tx = await supplyChainCore.manufactureComponents(1, "2gb ram, snapdragon cpu, 5inch display", basePrice, { from: defaultAccount });
        let {logs} = tx;
        const log = logs[0];
        if(log){
            eventEmitted = true;
        }
        // console.log(log);

        // let event = supplyChainCore.ComponentsManufactured();
        // await event.watch((err, res) => {
        //     eventEmitted = true;
        // })

        assert.equal(eventEmitted, true, "Smartphone components not manufactured");
    });

    it("Can get the price of the item", async () => {
        let cost = await supplyChainCore.getItemPrice(1);
        assert.equal(+cost, basePrice, "Cost value is not as expected");
    });

    it("Smartphone maker can assemble the parts", async () => {
        let eventEmitted = false;
        let event = supplyChainCore.SmartphoneAssembled();
        await event.watch((err, res) => {
            eventEmitted = true;
        })
        await supplyChainCore.assembleSmartphone(1, basePrice, { from: smartphoneMaker });

        assert.equal(eventEmitted, true, "Smartphone assembled");
    });

    it("smartphone maker cost is added", async () => {
        let cost = await supplyChainCore.getItemPrice(1);
        assert.equal(+cost, 2 * basePrice, "Cost value is not as expected");
    });

    it("Retailer can buy from smartphone maker", async () => {

        let retailerBalanceBefore = +web3.eth.getBalance(retailer);
        let smartphoneMakerBalanceBefore = +web3.eth.getBalance(smartphoneMaker);

        let itemCost = await supplyChainCore.getItemPrice(1);
        await supplyChainCore.retailerBuy(1, { from: retailer, gasPrice: 0, value: +itemCost });

        let retailerBalanceAfter = +web3.eth.getBalance(retailer);
        let smartphoneMakerBalanceAfter = +web3.eth.getBalance(smartphoneMaker);

        assert.equal(retailerBalanceAfter, retailerBalanceBefore - +itemCost, "should have correct balance");
        assert.equal(smartphoneMakerBalanceAfter, smartphoneMakerBalanceBefore + +itemCost, "should have correct balance");

    });

    it("Retailer can mark the smartphone has reached to him", async () => {
        let eventEmitted = false;
        let event = supplyChainCore.ReceivedByRetailer();
        await event.watch((err, res) => {
            eventEmitted = true;
        });

        await supplyChainCore.markReceivedByRetailer(1, { from: retailer });
        assert.equal(eventEmitted, true, "Received by retailer event not fired");

    });

    it("Retailer can put the smartphone on sale", async () => {
        let eventEmitted = false;
        let event = supplyChainCore.OnSale();
        await event.watch((err, res) => {
            eventEmitted = true;
        });

        await supplyChainCore.putForSale(1, basePrice, { from: retailer });
        assert.equal(eventEmitted, true, "should have put smartphone on sale");
    });

    it("Should get the current selling price of product by retailer", async () => {
        let itemPrice = await supplyChainCore.getItemPrice(1);

        assert.equal(+itemPrice, 3 * +basePrice, "Should have displayed the proper selling price");
    });

    it("Retailer cannot ship to consumer before it is sold", async () => {
        let eventEmitted = false;
        let event = supplyChainCore.ShippedToConsumer();
        await event.watch((err, res) => {
            eventEmitted = true;
        });
        try {

            await supplyChainCore.shipToConsumer(1, { from: retailer });
        } catch (e) {

            assert.equal(eventEmitted, false, "Shipped to consumer event fired");
        }
    });

    it("Consumer can buy the smartphone", async () => {
        let retailerBalanceBefore = +web3.eth.getBalance(retailer);
        let consumerBalanceBefore = +web3.eth.getBalance(consumer);

        let itemCost = await supplyChainCore.getItemPrice(1);
        await supplyChainCore.consumerBuy(1, { from: consumer, gasPrice: 0, value: +itemCost });

        let retailerBalanceAfter = +web3.eth.getBalance(retailer);
        let consumerBalanceAfter = +web3.eth.getBalance(consumer);

        assert.equal(consumerBalanceAfter, consumerBalanceBefore - +itemCost, "should have correct balance");
        assert.equal(retailerBalanceAfter, retailerBalanceBefore + +itemCost, "should have correct balance");
    });

    it("Retailer now can ship to consumer", async () => {
        let eventEmitted = false;
        let event = supplyChainCore.ShippedToConsumer();
        await event.watch((err, res) => {
            eventEmitted = true;
        });

        await supplyChainCore.shipToConsumer(1, { from: retailer });
        assert.equal(eventEmitted, true, "Shipped to consumer event not fired");
    });

    it("Consumer can mark smartphone received", async () => {
        let eventEmitted = false;
        let event = supplyChainCore.ReceivedByConsumer();
        await event.watch((err, res) => {
            eventEmitted = true;
        });

        await supplyChainCore.markReceivedByConsumer(1, { from: consumer });
        assert.equal(eventEmitted, true, "Shipped to consumer event not fired");
    });

    it("Can get the complete item information", async () => {
        let itemInfo = await supplyChainCore.getItemInfo(1);
        assert(itemInfo[1] == 1);
        assert(itemInfo[5] == "2gb ram, snapdragon cpu, 5inch display");
        assert(+itemInfo[6] == +web3.toWei(3,"ether"));
    });
});