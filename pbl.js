// ================= DATA DUMMY APLIKASI =================
const itemsData = [
    {
        id: 1,
        title: "barang",
        category: "Dompet",
        type: "Penemuan",
        location: "lokai",
        date: "2026-10-25",
        status: "Belum Diklaim",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4nKMWFXDpzDNc1UhQLrbCgJduOE-h2DAE2RLFlTW0ZA&s",
        description: "Berisi StNK motor, beberapa uang tunai, dan kartu e-money bergambar kustom."
    },
    {
        id: 2,
        title: "barang ",
        category: "Kunci",
        type: "Penemuan",
        location: "lokasi",
        date: "tanggal",
        status: "keadaan",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4nKMWFXDpzDNc1UhQLrbCgJduOE-h2DAE2RLFlTW0ZA&s",
        description: "Tertinggal di atas meja dosen kelas GKA 201 jam 10 pagi."
    },
    {
        id: 3,
        title: "barang",
        category: "Dokumen",
        type: "Kehilangan",
        location: "kokasi",
        date: "tanggal",
        status: "Mencari Pemilik",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4nKMWFXDpzDNc1UhQLrbCgJduOE-h2DAE2RLFlTW0ZA&s",
        description: "penjelasan."
    },
    {
        id: 4,
        title: "barang",
        category: "katagory",
        type: "Penemuan",
        location: "lokasi",
        date: "tanggal",
        status: "status",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4nKMWFXDpzDNc1UhQLrbCgJduOE-h2DAE2RLFlTW0ZA&s",
        description: "penjelasan"
    }
];

const pendingVerifications = [
    { id: 101, item: "Botol Minum Tupperware", user: "Siti Rahma", loc: "Gedung B", type: "Penemuan" },
    { id: 102, item: "Tas Ransel Laptop", user: "Rian Hidayat", loc: "Parkiran Motor", type: "Kehilangan" }
];

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
    renderItems(itemsData);
    renderPendingAdmin();
});

// ================= ROLE SWITCHING (USER <-> ADMIN) =================
function switchRole(role) {
    const userView = document.getElementById('user-view');
    const adminView = document.getElementById('admin-view');
    const btnUser = document.getElementById('btn-role-user');
    const btnAdmin = document.getElementById('btn-role-admin');

    if (role === 'user') {
        userView.classList.remove('hidden');
        userView.classList.add('active');
        adminView.classList.add('hidden');
        adminView.classList.remove('active');

        btnUser.classList.add('active');
        btnAdmin.classList.remove('active');
    } else {
        adminView.classList.remove('hidden');
        adminView.classList.add('active');
        userView.classList.add('hidden');
        userView.classList.remove('active');

        btnAdmin.classList.add('active');
        btnUser.classList.remove('active');
    }
}

// ================= USER NAVIGATION =================
function switchUserTab(tabName) {
    const authSec = document.getElementById('user-auth');
    const homeSec = document.getElementById('user-home');
    const reportSec = document.getElementById('user-report');

    // Reset visibility
    authSec.classList.add('hidden');
    homeSec.classList.add('hidden');
    reportSec.classList.add('hidden');

    // Reset bottom nav buttons
    document.querySelectorAll('.bottom-nav .nav-item').forEach(btn => btn.classList.remove('active'));

    if (tabName === 'home') {
        homeSec.classList.remove('hidden');
        event.currentTarget.classList.add('active');
    } else if (tabName === 'report') {
        reportSec.classList.remove('hidden');
        event.currentTarget.classList.add('active');
    } else if (tabName === 'auth') {
        authSec.classList.remove('hidden');
        event.currentTarget.classList.add('active');
    }
}

function toggleAuthTab(type) {
    const formLogin = document.getElementById('form-login');
    const formReg = document.getElementById('form-register');
    const buttons = document.querySelectorAll('.auth-toggle button');

    buttons.forEach(btn => btn.classList.remove('active'));

    if (type === 'login') {
        formLogin.classList.remove('hidden');
        formReg.classList.add('hidden');
        buttons[0].classList.add('active');
    } else {
        formReg.classList.remove('hidden');
        formLogin.classList.add('hidden');
        buttons[1].classList.add('active');
    }
}

// ================= RENDER ITEMS & FILTERING =================
function renderItems(data) {
    const grid = document.getElementById('item-grid');
    grid.innerHTML = '';

    if (data.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Tidak ada barang yang ditemukan.</p>`;
        return;
    }

    data.forEach(item => {
        const badgeClass = item.type === 'Penemuan' ? 'badge-success' : 'badge-danger';
        const card = document.createElement('div');
        card.className = 'item-card';
        card.onclick = () => openModal(item);

        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="item-card-body">
                <h4>${item.title}</h4>
                <p><i class="fa-solid fa-location-dot"></i> ${item.location}</p>
                <p><i class="fa-solid fa-calendar-days"></i> ${item.date}</p>
                <span class="badge ${badgeClass}">${item.type}</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterCategory(category) {
    // Active chip UI
    document.querySelectorAll('.category-chips .chip').forEach(chip => {
        chip.classList.remove('active');
    });
    event.currentTarget.classList.add('active');

    if (category === 'semua') {
        renderItems(itemsData);
    } else {
        const filtered = itemsData.filter(i => i.category === category);
        renderItems(filtered);
    }
}

function filterItems() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filtered = itemsData.filter(i => 
        i.title.toLowerCase().includes(query) || 
        i.location.toLowerCase().includes(query) ||
        i.category.toLowerCase().includes(query)
    );
    renderItems(filtered);
}

// ================= FORM SUBMISSION =================
function handleReportSubmit(e) {
    e.preventDefault();
    
    const newReport = {
        id: itemsData.length + 1,
        title: document.getElementById('report-name').value,
        category: document.getElementById('report-category').value,
        type: document.getElementById('report-type').value,
        location: document.getElementById('report-location').value,
        date: document.getElementById('report-date').value,
        status: "Menunggu Verifikasi",
        image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400", // Fallback placeholder image
        description: document.getElementById('report-desc').value
    };

    itemsData.unshift(newReport);
    alert('Laporan berhasil dikirim! Menunggu verifikasi dari tim Security Kampus.');
    
    document.getElementById('report-form').reset();
    switchUserTab('home');
}

// ================= MODAL SYSTEM =================
function openModal(item) {
    document.getElementById('modal-img').src = item.image;
    document.getElementById('modal-title').innerText = item.title;
    document.getElementById('modal-location').innerText = item.location;
    document.getElementById('modal-date').innerText = item.date;
    document.getElementById('modal-desc').innerText = item.description;
    
    const statusBadge = document.getElementById('modal-status');
    statusBadge.innerText = item.type;
    statusBadge.className = `badge ${item.type === 'Penemuan' ? 'badge-success' : 'badge-danger'}`;
    
    document.getElementById('modal-category').innerText = item.category;
    document.getElementById('item-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('item-modal').classList.add('hidden');
}

function submitClaim() {
    alert('Permintaan Klaim / Verifikasi telah dikirim ke Tim Security! Silakan datang ke Posko Pos Utama dengan membawa Bukti Identitas/KTM.');
    closeModal();
}

// ================= ADMIN TABS & MANAGEMENT =================
function switchAdminTab(tabName) {
    const dash = document.getElementById('admin-dashboard');
    const daily = document.getElementById('admin-daily');
    const monthly = document.getElementById('admin-monthly');
    const tabs = document.querySelectorAll('.admin-tab');

    dash.classList.add('hidden');
    daily.classList.add('hidden');
    monthly.classList.add('hidden');

    tabs.forEach(t => t.classList.remove('active'));

    if (tabName === 'dashboard') {
        dash.classList.remove('hidden');
        tabs[0].classList.add('active');
    } else if (tabName === 'daily') {
        daily.classList.remove('hidden');
        tabs[1].classList.add('active');
    } else if (tabName === 'monthly') {
        monthly.classList.remove('hidden');
        tabs[2].classList.add('active');
    }
}

function renderPendingAdmin() {
    const tbody = document.getElementById('admin-pending-list');
    tbody.innerHTML = '';

    pendingVerifications.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${row.item}</strong></td>
            <td>${row.user}</td>
            <td>${row.loc}</td>
            <td><span class="badge ${row.type === 'Penemuan' ? 'badge-success' : 'badge-danger'}">${row.type}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="approveItem(${row.id})">Setujui</button>
                <button class="btn btn-sm btn-outline" onclick="rejectItem(${row.id})">Tolak</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function approveItem(id) {
    alert(`Laporan ID #${id} disetujui dan dipublikasikan ke aplikasi.`);
    removePending(id);
}

function rejectItem(id) {
    alert(`Laporan ID #${id} ditolak.`);
    removePending(id);
}

function removePending(id) {
    const index = pendingVerifications.findIndex(i => i.id === id);
    if (index > -1) {
        pendingVerifications.splice(index, 1);
        renderPendingAdmin();
    }
}