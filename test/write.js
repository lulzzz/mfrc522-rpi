"use strict";
const mfrc522 = new (require("./../index"))();

//# This loop keeps checking for chips. If one is near it will get the UID and authenticate
console.log("scanning...");
console.log("Please put chip or keycard in the antenna inductive zone!");
console.log("Press Ctrl-C to stop.");

setInterval(function(){

    //# Scan for cards
    let response = mfrc522.findCard();
    if (!response.status) {
        return;
    }
    console.log("Card detected, CardType: " + response.bitSize);

    //# Get the UID of the card
    response = mfrc522.getUid();
    if (!response.status) {
        console.log("UID Scan Error");
        return;
    }
    //# If we have the UID, continue
    const uid = response.data;
    console.log("Card read UID: %s %s %s %s", uid[0].toString(16), uid[1].toString(16), uid[2].toString(16), uid[3].toString(16));

    //# Select the scanned card
    const memoryCapacity = mfrc522.selectCard(uid);
    console.log("Card Memory Capacity: " + memoryCapacity);

    //# This is the default key for authentication
    const key = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF];

    //# Authenticate on Block 8 with key and uid
    if (!mfrc522.authenticate(8, key, uid)) {
        console.log("Authentication Error");
        return;
    }

    //# Variable for the data to write
    let data = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF];

    console.log("Block 8 looked like this:");
    console.log(mfrc522.getDataForBlock(8));

    console.log("Block 8 will be filled with 0xFF:");
    mfrc522.writeDataToBlock(8, data);

    console.log("Now Block 8 looks like this:");
    console.log(mfrc522.getDataForBlock(8));

    data = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];

    console.log("Now we fill it with 16 x 0");
    mfrc522.writeDataToBlock(8, data);

    console.log("It is now empty:");
    console.log(mfrc522.getDataForBlock(8));

    mfrc522.stopCrypto();

    console.log("finished successfully!");


}, 500);