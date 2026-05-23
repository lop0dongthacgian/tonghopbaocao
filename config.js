// ============================================================
//  CẤU HÌNH ỨNG DỤNG TỔNG HỢP BÁO CÁO
//  Đặt file này cùng thư mục với index.html
// ============================================================

// URL Apps Script sau khi deploy DriveReader.gs
// Lấy tại: script.google.com → Triển khai → Triển khai mới → Ứng dụng web
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyvQeWn7oASbweF5D08QY1lZuOmdhBQ4IQMRlY5wbcYc5wR4rtPv0e-btefHN8LxOA/exec';

// Link thư mục Google Drive chứa báo cáo
// Dán link thư mục vào đây — app sẽ tự dùng, không cần nhập lại mỗi lần
// Ví dụ: 'https://drive.google.com/drive/folders/1abc...xyz'
const DEFAULT_DRIVE_FOLDER = 'https://drive.google.com/drive/folders/1flbn6cXpqFETqwptzrZB41PgNMxG2jRQ';
