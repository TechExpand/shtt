
const axios = require("axios")

export const sendNotification = (token: String, title: String, body: String) => {
    axios.post('https://fcm.googleapis.com/fcm/send',
        JSON.stringify({
            notification: {
                title,
                body,
                sound: "alert.mp3",
            },
            priority: 'high',
            sound: "alert.mp3",
            data: {
                click_action: 'FLUTTER_NOTIFICATION_CLICK',
                id: '1',
                sound: "alert.mp3",
            },
            apns: {
                payload: {
                    aps: {
                        sound: "alert.mp3",
                    }
                }
            },
            to: token,
        }),
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `key=${process.env.SERVER_TOKEN}`,
            }
        }
    )
        .then(function (response) {

            return response;
        })
        .catch(function (error) {

            return { error: "failed" }
        });

}