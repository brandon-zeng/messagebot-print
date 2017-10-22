// Handles messages events
function handleMessage(sender_psid, received_message) {

    let response;

    // Check if the message contains text
    if (received_message.text) {

        // Create the payload for a basic text message
        response = {
            "text": `You sent the message: "${received_message.text}". Now send me an image!`
        }
    }

    // Sends the response message
    callSendAPI(sender_psid, response);

}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {

    const PAGE_ACCESS_TOKEN = "EAACouNekzsIBAHZChu8T7twNjDR4ZCiz3o1es1mdxrSLgBnOyNpXocdo7l2ST7t6XqNLeWu77iIMFZAzUWvtq0fejijw67vvD6834tW61wOyVZA4uSjdiwdghZC0BkGEeyGJanPX1IhRZB08jsBx8t4NneKldI8rjDRQmm9u7zLgZDZD";
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });

}

module.exports = {
    handleMessage,
    handlePostback
}