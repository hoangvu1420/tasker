
**Tổng quan:**

- App là **ứng dụng quản lý thời gian / lịch trình**, kết hợp với một **thú cưng ảo** để **tăng động lực** cho người dùng.
- Hướng tới làm **MVP** trước (phiên bản nhỏ nhất có thể dùng được).

---

**Giao diện chính hiện tại:**

- **Chia làm 2 phần chính:**
  - **Bên trái**: 
    - Thú cưng (ở đây là bé **Gâu Gâu**), có thể **nói** những câu nhắc nhở như “Đến giờ học rồi cậu chủ ơi”.
    - Hiển thị thông tin thú cưng (ví dụ: tuổi, trạng thái, v.v.).
  - **Bên phải**:
    - Lịch biểu chứa các nhiệm vụ của người dùng.
    - Có thể thêm, sửa, xóa nhiệm vụ.

---

**Các tính năng chính cho MVP:**

1. **Hiển thị thú cưng**:
   - Avatar, tuổi, trạng thái thú cưng (biểu cảm / hành động theo lịch trình).
2. **Danh sách nhiệm vụ**:
   - Gồm: Tên, Thời gian, Hạn chót, Mức ưu tiên, Mô tả (optional).
3. **Thêm / Sửa / Xóa nhiệm vụ**:
   - Popup hoặc form để điền thông tin nhiệm vụ.
4. **Tích điểm**:
   - Khi **lập kế hoạch** (khi thêm nhiệm vụ mới).
   - Khi **hoàn thành nhiệm vụ**.

---

- **Mức ưu tiên nhiệm vụ**:
  - Cao
  - Trung bình
  - Thấp
  - Cố định (ví dụ lịch học, làm việc → có thể hiện màu khác biệt, ví dụ xanh dương nhẹ).

- **Trạng thái thú cưng**:
  - Vui vẻ 😄
  - Buồn 😢
  - Giận 😠
  - Bình thường 🙂
  - Ngủ 😴
  (Mỗi trạng thái sẽ đi kèm 1 câu thoại riêng)

- **Hoàn thành nhiệm vụ**:
  - Click vào nhiệm vụ → hiện **popup chi tiết** → có nút **"Đánh dấu hoàn thành"**.

- **Tích điểm / Tuổi thú cưng**:
  - **3 nhiệm vụ hoàn thành** → **+1 ngày tuổi**.
