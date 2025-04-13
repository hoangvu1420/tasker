# Cấu trúc và Logic của Ứng Dụng Quản Lý Thời Gian

## Cấu trúc Thư mục

```
src/
├── components/           # Chứa các component UI tách biệt
│   ├── Calendar.jsx      # Component hiển thị lịch và quản lý tasks
│   ├── Pet.jsx           # Component hiển thị thú cưng và trạng thái
│   ├── TaskModal.jsx     # Component modal tùy chỉnh để thêm/sửa nhiệm vụ
│   └── ConfirmDialog.jsx # Component modal xác nhận khi xóa nhiệm vụ
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
  - `handleDeleteTask()`: Xóa nhiệm vụ và cập nhật tâm trạng thú cưng thành buồn

- **Lưu trữ dữ liệu**:
  - Sử dụng localStorage để lưu trữ danh sách nhiệm vụ
  - Tự động tải dữ liệu từ localStorage khi khởi động
  - Tự động lưu dữ liệu vào localStorage khi có thay đổi

### Calendar.jsx - Component Lịch

- Sử dụng DayPilot để hiển thị lịch. Documentation: [DayPilot](https://code.daypilot.org/42221/react-weekly-calendar-tutorial)

- **State cục bộ**:
  - `calendar`: Tham chiếu đến control calendar của DayPilot
  - `showModal`: Kiểm soát hiển thị TaskModal
  - `selectedTask`: Nhiệm vụ hiện tại được chọn để chỉnh sửa

- **Props nhận vào**:
  - `events`: Danh sách nhiệm vụ
  - `startDate` & `setStartDate`: Ngày được chọn và hàm cập nhật
  - `onAddTask`: Callback khi thêm nhiệm vụ
  - `onUpdateTask`: Callback khi cập nhật nhiệm vụ
  - `onDeleteTask`: Callback khi xóa nhiệm vụ

- **Chức năng**:
  - Hiển thị lịch theo tuần
  - Cho phép người dùng chọn khoảng thời gian để tạo nhiệm vụ mới
  - Cho phép người dùng click vào nhiệm vụ để chỉnh sửa
  - Hiển thị nhiệm vụ với màu sắc tương ứng với mức ưu tiên
  - Mở TaskModal tùy chỉnh thay vì sử dụng modal có sẵn của DayPilot

### TaskModal.jsx - Component Modal Nhiệm Vụ

- **Props nhận vào**:
  - `isOpen`: Trạng thái hiển thị modal
  - `onClose`: Hàm đóng modal
  - `task`: Dữ liệu nhiệm vụ (null nếu đang tạo mới)
  - `onSave`: Callback khi lưu nhiệm vụ
  - `onDelete`: Callback khi xóa nhiệm vụ

- **State cục bộ**:
  - `formData`: Dữ liệu form nhiệm vụ
  - `showConfirmDialog`: Điều khiển hiển thị dialog xác nhận xóa

- **Chức năng**:
  - Form nhập liệu đầy đủ cho nhiệm vụ: tên, thời gian, mức ưu tiên, mô tả
  - Hiển thị thời gian bắt đầu và kết thúc từ khoảng thời gian được chọn
  - Cho phép chọn mức độ ưu tiên với hiển thị trực quan bằng màu sắc
  - Hỗ trợ thêm mô tả chi tiết (không bắt buộc)
  - Nút xóa nhiệm vụ (chỉ hiển thị khi chỉnh sửa nhiệm vụ hiện có)
  - Hiển thị ConfirmDialog khi người dùng muốn xóa nhiệm vụ

### ConfirmDialog.jsx - Component Xác Nhận

- **Props nhận vào**:
  - `isOpen`: Trạng thái hiển thị dialog
  - `onClose`: Hàm đóng dialog
  - `onConfirm`: Callback khi người dùng xác nhận hành động
  - `title`: Tiêu đề hộp thoại
  - `message`: Nội dung thông báo

- **Chức năng**:
  - Hiển thị hộp thoại xác nhận khi thực hiện các hành động quan trọng
  - Thay thế hộp thoại xác nhận mặc định của trình duyệt
  - Thiết kế phù hợp với phong cách UI của ứng dụng

## Các Giá Trị Constants

### colors.js

- **PRIORITY_COLORS**: Định nghĩa màu sắc cho các mức độ ưu tiên nhiệm vụ
  - `HIGH`: Đỏ (#cc4125) - Nhiệm vụ ưu tiên cao
  - `MEDIUM`: Vàng (#f1c232) - Nhiệm vụ ưu tiên trung bình
  - `LOW`: Xanh lá (#6aa84f) - Nhiệm vụ ưu tiên thấp
  - `FIXED`: Xanh dương (#3d85c6) - Sự kiện cố định (lịch học, làm việc)

## Luồng Hoạt Động

1. Khi người dùng **chọn khoảng thời gian** trên lịch:
   - `Calendar.onTimeRangeSelected` được gọi và mở TaskModal
   - Thời gian bắt đầu và kết thúc được truyền vào TaskModal
   - Sau khi nhập thông tin và xác nhận, `onAddTask` prop được gọi
   - `App.handleAddTask` thêm nhiệm vụ vào state và cập nhật tâm trạng thú cưng
   - Nhiệm vụ mới được lưu vào localStorage

2. Khi người dùng **click vào nhiệm vụ** trên lịch:
   - `Calendar.onEventClick` được gọi và mở TaskModal với dữ liệu nhiệm vụ đã có
   - Người dùng có thể chỉnh sửa các thông tin nhiệm vụ
   - Sau khi chỉnh sửa và xác nhận, `onUpdateTask` prop được gọi
   - `App.handleUpdateTask` cập nhật nhiệm vụ trong state và thay đổi thông điệp của thú cưng
   - Thay đổi được lưu vào localStorage

3. Khi người dùng **xóa nhiệm vụ**:
   - Người dùng click nút "Xóa" trong TaskModal
   - ConfirmDialog hiển thị để xác nhận hành động
   - Nếu xác nhận, `onDelete` prop được gọi
   - `App.handleDeleteTask` xóa nhiệm vụ khỏi state và cập nhật tâm trạng thú cưng thành buồn
   - Thay đổi được lưu vào localStorage

4. Khi state của App thay đổi:
   - `Pet` component nhận props mới và render lại với thông điệp và tâm trạng mới
   - `Calendar` component nhận events mới và render lại lịch với các nhiệm vụ cập nhật

## Tương Tác Người Dùng

- **Lập kế hoạch mới**: Chọn khoảng thời gian trên lịch → Nhập thông tin nhiệm vụ → Lưu
- **Chỉnh sửa nhiệm vụ**: Click vào nhiệm vụ trên lịch → Sửa thông tin → Lưu
- **Xóa nhiệm vụ**: Click vào nhiệm vụ → Click nút "Xóa" → Xác nhận trong hộp thoại
- **Điều hướng lịch**: Sử dụng DatePicker (DayPilotNavigator) để chọn ngày/tuần khác
