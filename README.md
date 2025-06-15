# Home Assistant Messenger Add-on

Add-on cho Home Assistant để nhận & chuyển tiếp webhook Facebook Messenger.

## 🛠️ Cài đặt

Trong Home Assistant:
1. Mở **Supervisor** > **Add-on Store**
2. Nhấn nút ⋮ > **Repositories**
3. Thêm repo GitHub của bạn (chứa thư mục `messenger-addon`)

## ⚙️ Cấu hình

Sau khi cài đặt, điền vào các thông tin:
- `PAGE_ACCESS_TOKEN`: Token Facebook Page
- `VERIFY_TOKEN`: Token xác minh webhook             # Tự đặt mã này và dùng nó để nhập vào mục "Xác minh mã" trên developers.facebook.com
- `HA_WEBHOOK_URL`: Địa chỉ webhook Home Assistant   # https://<homeassistant.local>:8123/api/webhook/messenger_inbox
- `HA_URL`: Link mở Home Assistant qua menu          # Link truy cập HA từ bên ngoài mạng: **https**://homeassistant.xxx:8123
- `TT_URL`: Link web thông tin thời tiết tại nơi bạn ở ( gợi ý: https://thoitietedu.tv/)
- `HA_TOKEN`: "your-long-lived-access-token"          # token lấy từ Home Assistant → Profile
## 🔗 Webhook

Trỏ webhook Facebook về: `http://<hass-ip>/webhook`    # Nhập vào mục "URL gọi lại" trên developers.facebook.com

## ✅ Ghi chú
- Add-on sẽ khởi động server Node.js và gửi tin nhắn về Home Assistant thông qua webhook.
