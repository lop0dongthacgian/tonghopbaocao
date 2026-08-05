// ============================================================
//  DriveReader.gs — HIGH ACCURACY VERSION
//  Xuất HTML thay vì plain text để giữ cấu trúc heading/bold/list
//  Kiến trúc 3 bước để tránh timeout:
//    Bước 1: action=listFolders → danh sách thư mục con + số file
//    Bước 2: action=list        → danh sách file ID trong thư mục
//    Bước 3: action=read        → đọc batch, trả HTML thay vì text
// ============================================================

// ── CẤU HÌNH ────────────────────────────────────────────────────
var DEFAULT_FOLDER_ID = '';
var MAX_FILES  = 500;
var BATCH_SIZE = 3;   // Giảm xuống 3 vì HTML nặng hơn plain text
// ────────────────────────────────────────────────────────────────

function doGet(e)  { return handleRequest(e); }
function doPost(e) { return handleRequest(e); }

function handleRequest(e) {
  var out = ContentService.createTextOutput();
  out.setMimeType(ContentService.MimeType.JSON);
  try {
    var p      = e.parameter || {};
    var action = p.action || 'listFolders';

    if (action === 'listFolders') {
      out.setContent(JSON.stringify(handleListFolders(p)));
    } else if (action === 'list') {
      out.setContent(JSON.stringify(handleList(p)));
    } else if (action === 'read') {
      out.setContent(JSON.stringify(handleRead(p)));
    } else {
      out.setContent(JSON.stringify({ ok: false, error: 'action không hợp lệ' }));
    }
  } catch (ex) {
    out.setContent(JSON.stringify({ ok: false, error: ex.message || 'Lỗi không xác định' }));
  }
  return out;
}

// ── BƯỚC 1: Liệt kê thư mục con (tháng) + đếm số file ──────────
function handleListFolders(p) {
  var folderId = resolveFolderId(p.folderUrl || '', p.folderId || '');
  if (!folderId) {
    return { ok: false, error: 'Chưa có thư mục. Dán link thư mục vào app hoặc điền DEFAULT_FOLDER_ID trong script.' };
  }

  var folder;
  try { folder = DriveApp.getFolderById(folderId); }
  catch (ex) { return { ok: false, error: 'Không truy cập được thư mục. Kiểm tra ID/quyền truy cập.' }; }

  var DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  var subFolders = [];

  var yearIt = folder.getFolders();
  while (yearIt.hasNext()) {
    var yearFolder = yearIt.next();
    var monthIt = yearFolder.getFolders();
    var hasMonths = false;
    while (monthIt.hasNext()) {
      hasMonths = true;
      var monthFolder = monthIt.next();
      var count = 0;
      var fi = monthFolder.getFilesByType(DOCX);
      while (fi.hasNext()) { fi.next(); count++; }
      subFolders.push({
        id: monthFolder.getId(), name: monthFolder.getName(),
        yearName: yearFolder.getName(), fileCount: count, folderId: folderId
      });
    }
    if (!hasMonths) {
      var count = 0;
      var fi = yearFolder.getFilesByType(DOCX);
      while (fi.hasNext()) { fi.next(); count++; }
      if (count > 0) {
        subFolders.push({
          id: yearFolder.getId(), name: yearFolder.getName(),
          yearName: yearFolder.getName(), fileCount: count, folderId: folderId
        });
      }
    }
  }

  if (subFolders.length === 0) {
    var count = 0;
    var fi = folder.getFilesByType(DOCX);
    while (fi.hasNext()) { fi.next(); count++; }
    if (count > 0) {
      subFolders.push({
        id: folderId, name: folder.getName(), yearName: '',
        fileCount: count, folderId: folderId, isRoot: true
      });
    }
  }

  return {
    ok: true, action: 'listFolders',
    folderName: folder.getName(), folderId: folderId,
    usingDefault: (!p.folderUrl && !p.folderId && !!DEFAULT_FOLDER_ID),
    folders: subFolders
  };
}

// ── BƯỚC 2: Liệt kê file .docx trong thư mục tháng ─────────────
function handleList(p) {
  var targetId = p.subFolderId || resolveFolderId(p.folderUrl || '', p.folderId || '');
  if (!targetId) {
    return { ok: false, error: 'Chưa có thư mục.' };
  }

  var folder;
  try { folder = DriveApp.getFolderById(targetId); }
  catch (ex) { return { ok: false, error: 'Không truy cập được thư mục.' }; }

  var allFiles = [];
  collectDocxFiles(folder, allFiles, folder.getName(), 0);

  if (allFiles.length === 0) {
    return { ok: false, error: 'Không tìm thấy file .docx nào trong "' + folder.getName() + '".' };
  }

  var totalOnDrive = allFiles.length;
  var truncated    = totalOnDrive > MAX_FILES;
  if (truncated) { allFiles = allFiles.slice(0, MAX_FILES); }

  return {
    ok: true, action: 'list',
    folderName: folder.getName(), folderId: targetId,
    total: allFiles.length, totalOnDrive: totalOnDrive,
    truncated: truncated, batchSize: BATCH_SIZE,
    // ▲ HIGH ACCURACY: báo trước để app chặn nếu bị cắt
    files: allFiles.map(function(f) {
      return { id: f.file.getId(), name: f.name, path: f.path };
    })
  };
}

// ── BƯỚC 3: Đọc một batch — TRẢ HTML THAY VÌ PLAIN TEXT ────────
function handleRead(p) {
  var idsParam = p.ids || '';
  if (!idsParam) return { ok: false, error: 'Thiếu tham số ids' };

  var ids     = idsParam.split(',').map(function(s){ return s.trim(); }).filter(Boolean);
  var token   = ScriptApp.getOAuthToken();
  var results = [];

  for (var i = 0; i < ids.length; i++) {
    var fileId = ids[i];
    try {
      var file = DriveApp.getFileById(fileId);
      // ▲ HIGH ACCURACY: đọc HTML thay vì plain text
      var html = extractDocxHtml(file, token);
      results.push({
        id: fileId,
        name: file.getName(),
        html: html || '',
        ok: true,
        format: 'html'   // cho app biết đây là HTML thật
      });
    } catch (ex) {
      results.push({ id: fileId, ok: false, error: ex.message || 'Lỗi đọc file' });
    }
  }

  return { ok: true, action: 'read', results: results };
}

// ── Trích xuất HTML (không plain text) ──────────────────────────
// Flow: upload DOCX → chuyển sang Google Doc → export HTML → xóa
function extractDocxHtml(file, token) {
  var fileId   = file.getId();
  var blob     = file.getBlob();
  var boundary = 'B_' + fileId.slice(0, 8);
  var meta     = JSON.stringify({
    title: '_r_' + fileId,
    mimeType: 'application/vnd.google-apps.document'
  });
  var body = '--' + boundary + '\r\n'
           + 'Content-Type: application/json; charset=UTF-8\r\n\r\n'
           + meta + '\r\n'
           + '--' + boundary + '\r\n'
           + 'Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document\r\n'
           + 'Content-Transfer-Encoding: base64\r\n\r\n'
           + Utilities.base64Encode(blob.getBytes()) + '\r\n'
           + '--' + boundary + '--';

  var upResp = UrlFetchApp.fetch(
    'https://www.googleapis.com/upload/drive/v2/files?uploadType=multipart&convert=true',
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'multipart/related; boundary=' + boundary
      },
      payload: body,
      muteHttpExceptions: true
    }
  );

  if (upResp.getResponseCode() !== 200) {
    throw new Error('Upload lỗi HTTP ' + upResp.getResponseCode());
  }

  var tempId = JSON.parse(upResp.getContentText()).id;
  if (!tempId) throw new Error('Không tạo được file tạm');

  var html = '';
  try {
    // ▲ Export HTML thay vì text/plain — giữ heading, bold, list
    var exResp = UrlFetchApp.fetch(
      'https://www.googleapis.com/drive/v3/files/' + tempId
      + '/export?mimeType=text/html',
      {
        headers: { Authorization: 'Bearer ' + token },
        muteHttpExceptions: true
      }
    );
    if (exResp.getResponseCode() === 200) {
      html = exResp.getContentText('UTF-8');
      // Giới hạn kích thước để tránh timeout (max ~800KB raw HTML)
      if (html.length > 800000) {
        html = html.slice(0, 800000);
        // Đánh dấu để app biết bị cắt
        html += '<!-- TRUNCATED -->';
      }
    }
  } finally {
    // Xóa VĨNH VIỄN file tạm
    try {
      UrlFetchApp.fetch(
        'https://www.googleapis.com/drive/v3/files/' + tempId,
        {
          method: 'DELETE',
          headers: { Authorization: 'Bearer ' + token },
          muteHttpExceptions: true
        }
      );
    } catch(e) {}
  }
  return html;
}

// ── Dọn dẹp file tạm tồn đọng (chạy thủ công khi cần) ──────────
function cleanupTempFiles() {
  var token = ScriptApp.getOAuthToken();
  var deleted = 0; var errors = 0;
  var query = 'title contains "_r_" and mimeType = "application/vnd.google-apps.document"';
  var files = DriveApp.searchFiles(query);
  while (files.hasNext()) {
    var f = files.next();
    if (!f.getName().startsWith('_r_')) continue;
    try {
      UrlFetchApp.fetch(
        'https://www.googleapis.com/drive/v3/files/' + f.getId(),
        { method: 'DELETE', headers: { Authorization: 'Bearer ' + token }, muteHttpExceptions: true }
      );
      deleted++;
    } catch(e) { errors++; }
  }
  Logger.log('✅ Đã xóa: ' + deleted + ' file tạm' + (errors ? ' | ⚠️ Lỗi: ' + errors : ''));
}

// ── Helpers ──────────────────────────────────────────────────────
function resolveFolderId(folderUrl, folderId) {
  if (folderId) return folderId;
  if (folderUrl) { var id = extractFolderId(folderUrl); if (id) return id; }
  if (DEFAULT_FOLDER_ID) return extractFolderId(DEFAULT_FOLDER_ID) || DEFAULT_FOLDER_ID;
  return null;
}

function extractFolderId(url) {
  if (!url) return null;
  url = url.trim();
  var m = url.match(/\/folders\/([a-zA-Z0-9_-]{10,})/);
  if (m) return m[1];
  m = url.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
  if (m) return m[1];
  if (/^[a-zA-Z0-9_-]{15,}$/.test(url)) return url;
  return null;
}

function collectDocxFiles(folder, out, pathSoFar, depth) {
  var DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  var MAX_DEPTH = 10;
  if (depth < MAX_DEPTH) {
    var si = folder.getFolders();
    while (si.hasNext()) {
      var sub = si.next();
      collectDocxFiles(sub, out, pathSoFar + ' › ' + sub.getName(), depth + 1);
    }
  }
  var it = folder.getFilesByType(DOCX);
  while (it.hasNext()) {
    var f = it.next();
    out.push({ file: f, name: f.getName(), path: pathSoFar });
  }
}
