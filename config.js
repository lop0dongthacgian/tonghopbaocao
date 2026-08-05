// ============================================================
//  CẤU HÌNH ỨNG DỤNG TỔNG HỢP BÁO CÁO
//  Đặt file này cùng thư mục với index.html
// ============================================================

// URL Apps Script sau khi deploy DriveReader.gs
// Lấy tại: script.google.com → Triển khai → Triển khai mới → Ứng dụng web
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw_afhX1duj3VCVJ1HWQaCHcsqP5jxFlDlOs9KFaMpMMzij92cMm19Pf4n-D8rXcdrNPQ/exec';

// Link thư mục Google Drive chứa báo cáo
// Dán link thư mục vào đây — app sẽ tự dùng, không cần nhập lại mỗi lần
// Ví dụ: 'https://drive.google.com/drive/folders/1abc...xyz'
const DEFAULT_DRIVE_FOLDER = 'https://drive.google.com/drive/folders/1kv0vD2K7uHTHH9FomaWLS8Pq5h5K4hHH';
