# Tasker - Ứng dụng Quản Lý Thời Gian với Thú Cưng Ảo

![Tasker Logo](public/vite.svg)

## Giới thiệu

Tasker là ứng dụng quản lý thời gian/lịch trình, kết hợp với một thú cưng ảo để tăng động lực cho người dùng. Dự án này được xây dựng bằng React và Vite, với giao diện được thiết kế bằng Tailwind CSS.

## Tính năng chính

- **Quản lý nhiệm vụ** - Thêm, sửa, xóa các nhiệm vụ và sự kiện trong lịch
- **Phân loại ưu tiên** - Đánh dấu mức ưu tiên của nhiệm vụ bằng màu sắc (Cao, Trung bình, Thấp, Cố định)
- **Thú cưng tương tác** - Thú cưng ảo phản hồi dựa trên hoạt động của người dùng
- **Hệ thống tích điểm** - Nhận điểm khi lập kế hoạch và hoàn thành nhiệm vụ

## Giao diện

Ứng dụng được chia làm 2 phần chính:

- **Bên trái**: Thú cưng ảo (Gâu Gâu) hiển thị trạng thái và thông điệp
- **Bên phải**: Lịch biểu chứa các nhiệm vụ của người dùng

## Cài đặt

```bash
# Clone repository
git clone <repository-url>

# Di chuyển vào thư mục dự án
cd tasker

# Cài đặt dependencies
npm install

# Chạy ở môi trường development
npm run dev
```

## Cấu trúc dự án

```
src/
├── components/           # Chứa các component UI tách biệt
│   ├── Calendar.jsx      # Component hiển thị lịch và quản lý tasks
│   └── Pet.jsx           # Component hiển thị thú cưng và trạng thái
├── constants/            # Chứa các hằng số được dùng xuyên suốt ứng dụng
│   └── colors.js         # Định nghĩa màu sắc cho các mức độ ưu tiên
├── assets/               # Tài nguyên tĩnh (hình ảnh, biểu tượng)
├── App.jsx               # Component chính, quản lý state toàn cục
└── main.jsx              # Điểm khởi chạy ứng dụng
```

## Hướng phát triển trong tương lai

- Lưu trữ dữ liệu người dùng với backend
- Thêm nhiều loại thú cưng ảo khác nhau
- Hệ thống thông báo và nhắc nhở
- Tính năng hoạt động nhóm và chia sẻ lịch biểu

## Công nghệ sử dụng

- **React** - Thư viện JavaScript để xây dựng giao diện người dùng
- **Vite** - Công cụ build nhanh cho các dự án hiện đại
- **Tailwind CSS** - Framework CSS tiện lợi
- **DayPilot** - Thư viện React Calendar

## Giấy phép

[MIT](LICENSE)
