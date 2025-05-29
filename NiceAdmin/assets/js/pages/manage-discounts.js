let currentPage = 1;
const recordsPerPage = 10;
let totalRecords = 0;

function loadDiscounts(page) {
    // Gọi API để lấy dữ liệu với tham số page và recordsPerPage
    fetch(`/api/discounts?page=${page}&limit=${recordsPerPage}`)
        .then(response => response.json())
        .then(data => {
            totalRecords = data.total;
            displayDiscounts(data.discounts);
            updatePagination();
        });
}

function displayDiscounts(discounts) {
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = '';
    
    discounts.forEach((discount, index) => {
        const row = `
            <tr>
                <td>${(currentPage - 1) * recordsPerPage + index + 1}</td>
                <td>${discount.discount_name}</td>
                <td>${formatNumber(discount.discount_value)}</td>
                <td>${discount.discount_unit}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-sm" title="Xem" onclick="viewDiscount(${discount.discount_id})">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button type="button" class="btn btn-warning btn-sm" title="Sửa" onclick="editDiscount(${discount.discount_id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-danger btn-sm" title="Xóa" onclick="deleteDiscount(${discount.discount_id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function updatePagination() {
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const pagination = document.querySelector('.pagination');
    let paginationHTML = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">&laquo;</a>
        </li>
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `;
    }
    
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">&raquo;</a>
        </li>
    `;
    
    pagination.innerHTML = paginationHTML;
    
    // Cập nhật thông tin hiển thị
    const start = (currentPage - 1) * recordsPerPage + 1;
    const end = Math.min(currentPage * recordsPerPage, totalRecords);
    document.querySelector('.pagination-info').textContent = 
        `Hiển thị ${start} đến ${end} của ${totalRecords} bản ghi`;
}

function changePage(page) {
    if (page < 1 || page > Math.ceil(totalRecords / recordsPerPage)) return;
    currentPage = page;
    loadDiscounts(page);
}

// Hàm format số
function formatNumber(number) {
    return new Intl.NumberFormat('vi-VN').format(number);
}

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', () => {
    loadDiscounts(1);
}); 