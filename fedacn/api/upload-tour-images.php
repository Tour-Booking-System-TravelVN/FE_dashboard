<?php
// Thiết lập header để trả về JSON
header('Content-Type: application/json');

// Kiểm tra phương thức request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Phương thức không được hỗ trợ']);
    exit;
}

// Kiểm tra xem có file nào được upload không
if (empty($_FILES['images'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Không có file nào được tải lên']);
    exit;
}

// Lấy tour_id nếu có
$tourId = isset($_POST['tour_id']) ? $_POST['tour_id'] : null;

// Tạo thư mục lưu ảnh nếu chưa tồn tại
$uploadDir = '../assets/img/tours/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Nếu có tour_id, tạo thư mục con cho tour đó
if ($tourId) {
    $tourDir = $uploadDir . $tourId . '/';
    if (!file_exists($tourDir)) {
        mkdir($tourDir, 0777, true);
    }
    $uploadDir = $tourDir;
}

$uploadedFiles = [];
$errors = [];

// Xử lý từng file được upload
foreach ($_FILES['images']['tmp_name'] as $key => $tmp_name) {
    // Kiểm tra lỗi upload
    if ($_FILES['images']['error'][$key] !== UPLOAD_ERR_OK) {
        $errors[] = 'Lỗi khi tải lên file ' . $_FILES['images']['name'][$key] . ': ' . $_FILES['images']['error'][$key];
        continue;
    }
    
    // Kiểm tra định dạng file
    $fileType = $_FILES['images']['type'][$key];
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    
    if (!in_array($fileType, $allowedTypes)) {
        $errors[] = 'File ' . $_FILES['images']['name'][$key] . ' không phải là ảnh hợp lệ';
        continue;
    }
    
    // Tạo tên file duy nhất
    $fileName = uniqid() . '_' . basename($_FILES['images']['name'][$key]);
    $targetPath = $uploadDir . $fileName;
    
    // Di chuyển file vào thư mục đích
    if (move_uploaded_file($tmp_name, $targetPath)) {
        $uploadedFiles[] = [
            'name' => $_FILES['images']['name'][$key],
            'path' => str_replace('../', '', $targetPath),
            'size' => $_FILES['images']['size'][$key]
        ];
    } else {
        $errors[] = 'Không thể di chuyển file ' . $_FILES['images']['name'][$key];
    }
}

// Trả về kết quả
if (count($uploadedFiles) > 0) {
    echo json_encode([
        'success' => true,
        'message' => 'Đã tải lên ' . count($uploadedFiles) . ' file thành công',
        'files' => $uploadedFiles,
        'errors' => $errors
    ]);
} else {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Không có file nào được tải lên thành công',
        'errors' => $errors
    ]);
} 