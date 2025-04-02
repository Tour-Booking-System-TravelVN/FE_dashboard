let currentPage = 1;
const recordsPerPage = 10;
let totalRecords = 0;

function loadTourGuides(page) {
    // Gọi API để lấy dữ liệu với tham số page và recordsPerPage
    fetch(`/api/tour-guides?page=${page}&limit=${recordsPerPage}`)
        .then(response => response.json())
        .then(data => {
            totalRecords = data.total;
            displayTourGuides(data.tourGuides);
            updatePagination();
        });
}

function displayTourGuides(tourGuides) {
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = '';
    
    tourGuides.forEach((tourGuide, index) => {
        const row = `
            <tr>
                <td>${(currentPage - 1) * recordsPerPage + index + 1}</td>
                <td>${tourGuide.firstname} ${tourGuide.lastname}</td>
                <td>${formatDate(tourGuide.date_of_birth)}</td>
                <td>${tourGuide.gender ? 'Nam' : 'Nữ'}</td>
                <td>${tourGuide.citizen_id || ''}</td>
                <td>${tourGuide.passport || ''}</td>
                <td>${tourGuide.phone_number || ''}</td>
                <td>${tourGuide.address || ''}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-sm" title="Xem" onclick="viewTourGuide(${tourGuide.t_id})">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button type="button" class="btn btn-warning btn-sm" title="Sửa" onclick="editTourGuide(${tourGuide.t_id})">  
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-danger btn-sm" title="Xóa" onclick="deleteTourGuide(${tourGuide.t_id})">
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
    loadTourGuides(page);
}

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', () => {
    loadTourGuides(1);   
}); 