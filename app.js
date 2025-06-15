const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');

// 🧼 Xoá log cũ + in dòng phân cách rõ ràng
console.clear();
console.log('\n🧼 ========================================');
console.log('▶️ Khởi động lại Messenger Add-on');
console.log('🕒 Thời gian:', new Date().toLocaleString());
console.log('🧼 ========================================\n');

// 🧠 Đọc cấu hình từ Home Assistant
let rawOptions = {};
try {
  rawOptions = JSON.parse(fs.readFileSync('/data/options.json'));
  //console.log('✅ Đã đọc cấu hình từ /data/options.json:', rawOptions);
} catch (e) {
  console.error('❌ Không thể đọc /data/options.json:', e.message);
  process.exit(1);
}

// 🧹 Hàm làm sạch chuỗi: cắt khoảng trắng, xuống dòng, ký tự thừa
function sanitize(value) {
  return typeof value === 'string'
    ? value.replace(/[\r\n\s]/g, '').trim()
    : '';
}

// ⚙️ Gán và làm sạch các biến cấu hình
const PAGE_ACCESS_TOKEN = sanitize(rawOptions.PAGE_ACCESS_TOKEN);
const VERIFY_TOKEN = sanitize(rawOptions.VERIFY_TOKEN);
const HA_WEBHOOK_URL = sanitize(rawOptions.HA_WEBHOOK_URL);
const HA_URL = sanitize(rawOptions.HA_URL);
const TT_URL = sanitize(rawOptions.TT_URL);
const HA_TOKEN = sanitize(rawOptions.HA_TOKEN);

// 🚀 Khởi tạo Express server
const app = express();
app.use(bodyParser.json());

// 📎 Facebook webhook verification
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verified thành công');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Webhook xác minh thất bại');
    res.sendStatus(403);
  }
});

// 📩 Nhận tin nhắn từ Messenger
app.post('/webhook', async (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    for (const entry of body.entry || []) {
      for (const event of entry.messaging || []) {
        const sender_psid = event.sender.id;
        const message_text = event.message?.text || null;

        let payload = null;
        let action_type = null;

        if (event.postback?.payload) {
          payload = event.postback.payload;
          action_type = 'button';
        } else if (event.message?.quick_reply?.payload) {
          payload = event.message.quick_reply.payload;
          action_type = 'quick_reply';
        }

        if (!message_text && !payload) continue;

        const eventData = {
          sender_id: sender_psid,
          text: message_text,
          payload: payload,
          action_type: action_type
        };

        try {
          await axios.post(`${HA_URL}/api/events/messenger_webhook`, eventData, {
            headers: {
              Authorization: `Bearer ${HA_TOKEN}`,
              'Content-Type': 'application/json'
            }
          });
          console.log('✅ Đã gửi sự kiện messenger_webhook:', eventData);
        } catch (err) {
          console.error('❌ Lỗi khi gửi đến Home Assistant:', err.response?.data || err.message);
        }
      }
    }

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// 🚀 Start server
const PORT = 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
});

// ✅ Gọi menu nếu bật trong cấu hình
const setupMenu = require('./setup-menu');

if (rawOptions.SETUP_MENU_ON_START === true) {
  setupMenu(); 
}
