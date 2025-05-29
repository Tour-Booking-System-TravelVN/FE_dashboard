let currentPage = 1;
const recordsPerPage = 10;
let totalRecords = 0;
let searchKeyword = '';

// Hàm tải danh sách tour
function loadTours(page) {
    // Gọi API để lấy dữ liệu với tham số page và recordsPerPage
    fetch(`/api/tours?page=${page}&limit=${recordsPerPage}&search=${searchKeyword}`)
        .then(response => response.json())
        .then(data => {
            totalRecords = data.total;
            displayTours(data.tours);
            updatePagination();
        });
}

// Hàm hiển thị danh sách tour
function displayTours(tours) {
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = '';
    
    tours.forEach((tour, index) => {
        const row = `
            <tr>
                <td>${(currentPage - 1) * recordsPerPage + index + 1}</td>
                <td>${tour.tour_id}</td>
                <td>${tour.tour_name}</td>
                <td>${tour.duration}</td>
                <td>${tour.vehicle}</td>
                <td>${tour.departure_place}</td>
                <td>${tour.places_to_visit}</td>
                <td>${formatDate(tour.created_time)}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-sm" title="Xem" onclick="viewTour('${tour.tour_id}')">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button type="button" class="btn btn-warning btn-sm" title="Sửa" onclick="editTour('${tour.tour_id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-danger btn-sm" title="Xóa" onclick="deleteTour('${tour.tour_id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Hàm cập nhật phân trang
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

// Hàm chuyển trang
function changePage(page) {
    if (page < 1 || page > Math.ceil(totalRecords / recordsPerPage)) return;
    currentPage = page;
    loadTours(page);
}

// Hàm định dạng ngày tháng
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Hàm xem chi tiết tour
function viewTour(tourId) {
    fetch(`/api/tours/${tourId}`)
        .then(response => response.json())
        .then(tour => {
            // Hiển thị thông tin tour trong modal xem chi tiết
            document.getElementById('viewTourId').textContent = tour.tour_id;
            document.getElementById('viewTourName').textContent = tour.tour_name;
            document.getElementById('viewDuration').textContent = tour.duration;
            document.getElementById('viewVehicle').textContent = tour.vehicle;
            document.getElementById('viewTargetAudience').textContent = tour.target_audience;
            document.getElementById('viewDeparturePlace').textContent = tour.departure_place;
            document.getElementById('viewPlacesToVisit').textContent = tour.places_to_visit;
            document.getElementById('viewCuisine').textContent = tour.cuisine;
            document.getElementById('viewIdealTime').textContent = tour.ideal_time;
            document.getElementById('viewDescription').textContent = tour.description || 'Không có mô tả';
            document.getElementById('viewInclusions').textContent = tour.inclusions;
            document.getElementById('viewExclusions').textContent = tour.exclusions;
            document.getElementById('viewCreatedTime').textContent = formatDate(tour.created_time);

            const modal = new bootstrap.Modal(document.getElementById('viewTourModal'));
            modal.show();
        });
}

// Hàm sửa tour
function editTour(tourId) {
    fetch(`/api/tours/${tourId}`)
        .then(response => response.json())
        .then(tour => {
            // Điền thông tin tour vào form sửa
            document.getElementById('editTourId').value = tour.tour_id;
            document.getElementById('editTourName').value = tour.tour_name;
            document.getElementById('editDuration').value = tour.duration;
            document.getElementById('editVehicle').value = tour.vehicle;
            document.getElementById('editTargetAudience').value = tour.target_audience;
            document.getElementById('editDeparturePlace').value = tour.departure_place;
            document.getElementById('editPlacesToVisit').value = tour.places_to_visit;
            document.getElementById('editCuisine').value = tour.cuisine;
            document.getElementById('editIdealTime').value = tour.ideal_time;
            document.getElementById('editDescription').value = tour.description || '';
            document.getElementById('editInclusions').value = tour.inclusions;
            document.getElementById('editExclusions').value = tour.exclusions;

            const modal = new bootstrap.Modal(document.getElementById('editTourModal'));
            modal.show();
        });
}

// Hàm cập nhật tour
function updateTour() {
    const tourId = document.getElementById('editTourId').value;
    const formData = {
        tour_name: document.getElementById('editTourName').value,
        duration: document.getElementById('editDuration').value,
        vehicle: document.getElementById('editVehicle').value,
        target_audience: document.getElementById('editTargetAudience').value,
        departure_place: document.getElementById('editDeparturePlace').value,
        places_to_visit: document.getElementById('editPlacesToVisit').value,
        cuisine: document.getElementById('editCuisine').value,
        ideal_time: document.getElementById('editIdealTime').value,
        description: document.getElementById('editDescription').value,
        inclusions: document.getElementById('editInclusions').value,
        exclusions: document.getElementById('editExclusions').value
    };

    fetch(`/api/tours/${tourId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('editTourModal'));
        modal.hide();
        loadTours(currentPage);
        // Hiển thị thông báo thành công
        alert('Cập nhật tour thành công!');
    })
    .catch(error => {
        alert('Có lỗi xảy ra khi cập nhật tour!');
    });
}

// Hàm xóa tour
function deleteTour(tourId) {
    if (confirm('Bạn có chắc chắn muốn xóa tour này không?')) {
        fetch(`/api/tours/${tourId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            loadTours(currentPage);
            // Hiển thị thông báo thành công
            alert('Xóa tour thành công!');
        })
        .catch(error => {
            alert('Có lỗi xảy ra khi xóa tour!');
        });
    }
}

// Hàm thêm tour mới
function saveTour() {
    const formData = {
        tour_name: document.getElementById('tourName').value,
        duration: document.getElementById('duration').value,
        vehicle: document.getElementById('vehicle').value,
        target_audience: document.getElementById('targetAudience').value,
        departure_place: document.getElementById('departurePlace').value,
        places_to_visit: document.getElementById('placesToVisit').value,
        cuisine: document.getElementById('cuisine').value,
        ideal_time: document.getElementById('idealTime').value,
        description: document.getElementById('description').value,
        inclusions: document.getElementById('inclusions').value,
        exclusions: document.getElementById('exclusions').value
    };

    fetch('/api/tours', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('addTourModal'));
        modal.hide();
        document.getElementById('addTourForm').reset();
        loadTours(currentPage);
        // Hiển thị thông báo thành công
        alert('Thêm tour mới thành công!');
    })
    .catch(error => {
        alert('Có lỗi xảy ra khi thêm tour mới!');
    });
}

// Hàm tìm kiếm tour
function searchTours() {
    searchKeyword = document.getElementById('searchInput').value.trim();
    currentPage = 1; // Reset về trang 1 khi tìm kiếm
    loadTours(1);
}

// Thêm sự kiện tìm kiếm khi nhấn Enter
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchTours();
    }
});

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', () => {
    loadTours(1);

    // Form validation
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
}); 