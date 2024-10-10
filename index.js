const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const CHECK_URL = process.env.CHECK_URL;

async function sendTelegramNotification(message) {
  try {
    const chatIdList = JSON.parse(TELEGRAM_CHAT_ID ? TELEGRAM_CHAT_ID : "[]");

    console.log(chatIdList);

    for (const chatID of chatIdList) {
      console.log(chatID);

      await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          chat_id: chatID,
          text: message,
        }
      );
    }

    console.log(`Notification sent: ${message}`);
  } catch (error) {
    console.error(`Error sending Telegram notification: ${error.message}`);
  }
}

async function checkNetwork() {
  try {
    const response = await axios.get(CHECK_URL, {
      timeout: 2000,
    });
    const data = response.data;

    console.log(data);
  } catch (error) {
    const errorMessage = `Error checking taoist network: ${error.message}`;
    console.error(errorMessage);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data)}`);
    }
    await sendTelegramNotification(errorMessage);
  }
}

async function main() {
  try {
    await checkNetwork();
  } catch (error) {
    const errorMessage = `Unhandled error in main execution: ${error.message}`;
    console.error(errorMessage);
    await sendTelegramNotification(errorMessage);
  }
}

main().catch(async (error) => {
  const errorMessage = `Critical error: ${error.message}`;
  console.error(errorMessage);
  await sendTelegramNotification(errorMessage);
});
