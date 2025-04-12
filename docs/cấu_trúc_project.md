# Cấu trúc và Logic của Ứng Dụng Quản Lý Thời Gian

## Cấu trúc Thư mục

```
src/
├── components/           # Chứa các component UI tách biệt
│   ├── Calendar.jsx      # Component hiển thị lịch và quản lý tasks
│   └── Pet.jsx           # Component hiển thị thú cưng và trạng thái
├── constants/            # Chứa các hằng số được dùng xuyên suốt ứng dụng
│   └── colors.js         # Định nghĩa màu sắc cho các mức độ ưu tiên
├── assets/               # Tài nguyên tĩnh (hình ảnh, biểu tượng)
├── App.jsx               # Component chính, quản lý state toàn cục
├── App.css               # CSS cho App component
├── main.jsx              # Điểm khởi chạy ứng dụng
└── index.css             # CSS toàn cục
```

## Luồng Dữ Liệu và Quản Lý State

### App.jsx - Component Chính
- **Quản lý state toàn cục**:
  - `events[]`: Danh sách các sự kiện/nhiệm vụ
  - `startDate`: Ngày hiện tại được chọn trên lịch
  - `petMood`: Tâm trạng hiện tại của thú cưng
  - `petMessage`: Thông điệp hiện tại của thú cưng

- **Logic xử lý chính**:
  - `handleAddTask()`: Thêm nhiệm vụ mới và cập nhật tâm trạng thú cưng
  - `handleUpdateTask()`: Cập nhật nhiệm vụ hiện có và phản hồi qua thú cưng

### Calendar.jsx - Component Lịch

- Sử dụng DayPilot để hiển thị lịch. Documentation: [DayPilot](https://code.daypilot.org/42221/react-weekly-calendar-tutorial)

- **State cục bộ**:
  - `calendar`: Tham chiếu đến control calendar của DayPilot

- **Props nhận vào**:
  - `events`: Danh sách nhiệm vụ
  - `startDate` & `setStartDate`: Ngày được chọn và hàm cập nhật
  - `onAddTask`: Callback khi thêm nhiệm vụ
  - `onUpdateTask`: Callback khi cập nhật nhiệm vụ

- **Chức năng**:
  - Hiển thị lịch theo tuần
  - Cho phép người dùng chọn khoảng thời gian để tạo nhiệm vụ mới
  - Cho phép người dùng click vào nhiệm vụ để chỉnh sửa
  - Hiển thị nhiệm vụ với màu sắc tương ứng với mức ưu tiên

### Pet.jsx - Component Thú Cưng
- **Props nhận vào**:
  - `name`: Tên thú cưng
  - `message`: Thông điệp hiện tại
  - `mood`: Tâm trạng hiện tại

- **Chức năng**:
  - Hiển thị hình ảnh thú cưng
  - Hiển thị bong bóng chat với thông điệp
  - Hiển thị trạng thái tâm trạng của thú cưng

## Các Giá Trị Constants

### colors.js
- **PRIORITY_COLORS**: Định nghĩa màu sắc cho các mức độ ưu tiên nhiệm vụ
  - `HIGH`: Đỏ (#cc4125) - Nhiệm vụ ưu tiên cao
  - `MEDIUM`: Vàng (#f1c232) - Nhiệm vụ ưu tiên trung bình
  - `LOW`: Xanh lá (#6aa84f) - Nhiệm vụ ưu tiên thấp
  - `FIXED`: Xanh dương (#3d85c6) - Sự kiện cố định (lịch học, làm việc)

## Luồng Hoạt Động

1. Khi người dùng **chọn khoảng thời gian** trên lịch:
   - `Calendar.onTimeRangeSelected` được gọi và hiển thị modal để nhập tên nhiệm vụ
   - Sau khi xác nhận, `onAddTask` prop được gọi
   - `App.handleAddTask` thêm nhiệm vụ vào state và cập nhật tâm trạng thú cưng

2. Khi người dùng **click vào nhiệm vụ** trên lịch:
   - `Calendar.onEventClick` được gọi và hiển thị modal để chỉnh sửa nhiệm vụ
   - Sau khi xác nhận, `onUpdateTask` prop được gọi
   - `App.handleUpdateTask` cập nhật nhiệm vụ trong state và thay đổi thông điệp của thú cưng

3. Khi state của App thay đổi:
   - `Pet` component nhận props mới và render lại với thông điệp và tâm trạng mới
   - `Calendar` component nhận events mới và render lại lịch với các nhiệm vụ cập nhật

## Tương Tác Người Dùng

- **Lập kế hoạch mới**: Chọn khoảng thời gian trên lịch → Nhập tên nhiệm vụ → Thêm
- **Chỉnh sửa nhiệm vụ**: Click vào nhiệm vụ trên lịch → Sửa tên → Lưu
- **Điều hướng lịch**: Sử dụng DatePicker (DayPilotNavigator) để chọn ngày/tuần khác
