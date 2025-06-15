const axios = require('axios');
const fs = require('fs');

// 🔄 Đọc cấu hình từ /data/options.json
let rawOptions = {};
try {
  rawOptions = JSON.parse(fs.readFileSync('/data/options.json'));
  //console.log('✅ Đã đọc cấu hình từ /data/options.json:', rawOptions);
} catch (e) {
  console.error('❌ Không thể đọc /data/options.json:', e.message);
  process.exit(1);
}

function sanitize(value) {
  return typeof value === 'string'
    ? value.replace(/[\r\n\s]/g, '').trim()
    : '';
}

// 🔧 Gán và làm sạch các biến cấu hình
const PAGE_ACCESS_TOKEN = sanitize(rawOptions.PAGE_ACCESS_TOKEN);
const TT_URL = sanitize(rawOptions.TT_URL);
const HA_URL = sanitize(rawOptions.HA_URL);

// 📋 Hàm gọi API Facebook để setup menu
async function setupMenu() {
  try {
    const request_body = {
      persistent_menu: [
        {
          locale: "default",
          composer_input_disabled: false,
          call_to_actions: [
            {
              type: "postback",
              title: "💡 Điều khiển thiết bị",
              payload: "DIEU_KHIEN"
            },
            {
              type: "postback",
              title: "🔌 Chức năng tuỳ chỉnh",
              payload: "OPTION"
            },
            {
              title: "📅 Xem lịch vạn niên",
              type: "web_url",
              url: "https://www.xemlicham.com",
              webview_height_ratio: "full"
            },
            {
              title: "🌦️ Thông tin thời tiết",
              type: "web_url",
              url: TT_URL,
              webview_height_ratio: "full"
            },
            {
              title: "📱 Mở Home Assistant",
              type: "web_url",
              url: HA_URL,
              webview_height_ratio: "full"
            }
          ]
        }
      ],
      get_started: {
        payload: "GET_STARTED"
      }
    };

    const res = await axios.post(
      `https://graph.facebook.com/v18.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
      request_body
    );

    console.log('✅ Đã thiết lập persistent menu và nút Bắt đầu.');
  } catch (err) {
    console.error('❌ Lỗi setup menu:', err.response?.data || err.message);
  }
}

// 🔁 Chạy nếu gọi trực tiếp
if (require.main === module) {
  setupMenu();
}

module.exports = setupMenu;
