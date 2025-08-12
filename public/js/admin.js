// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
  loadDataFromServer();
});

// Load all data from server
async function loadDataFromServer() {
  try {
    const [stats, pendaftar, pesan, kelas] = await Promise.all([
      fetch('http://localhost:5000/api/admin/stats').then(res => res.json()),
      fetch('http://localhost:5000/api/admin/pendaftar').then(res => res.json()),
      fetch('http://localhost:5000/api/admin/pesan').then(res => res.json()),
      fetch('http://localhost:5000/api/admin/kelas').then(res => res.json())
    ]);

    updateStats(stats);
    loadPendaftarData(pendaftar);
    loadPesanData(pesan);
    loadKelasData(kelas);
  } catch (error) {
    console.error('Error loading data:', error);
    // Fallback to demo data if server is not available
    loadDemoData();
  }
}

// Demo data fallback
function loadDemoData() {
  const demoStats = {
    totalPendaftar: 2,
    kelasAktif: 4,
    pendapatan: 2400000,
    pesanBaru: 1
  };
  
  const demoPendaftar = [
    {
      id: 1,
      nama: 'Joko Anwar',
      email: 'joko@email.com',
      kelas: 'Kelas Dasar (N5)',
      status: 'Terdaftar',
      tanggal: '2024-01-15'
    },
    {
      id: 2,
      nama: 'Siti Nurhaliza',
      email: 'siti@email.com',
      kelas: 'Kelas Menengah (N4-N3)',
      status: 'Pembayaran',
      tanggal: '2024-01-14'
    }
  ];

  const demoPesan = [
    {
      id: 1,
      nama: 'Ahmad',
      email: 'ahmad@email.com',
      pesan: 'Saya tertarik dengan kelas JLPT, bisa dijelaskan lebih detail?',
      tanggal: '2024-01-15 14:30'
    }
  ];

  const demoKelas = [
    {
      id: 1,
      nama: 'Kelas Dasar (N5)',
      deskripsi: 'Belajar huruf, kosakata, dan percakapan dasar',
      durasi: '4 bulan',
      harga: 1200000,
      peserta: 8
    },
    {
      id: 2,
      nama: 'Kelas Menengah (N4-N3)',
      deskripsi: 'Pendalaman tata bahasa, kanji, dan percakapan menengah',
      durasi: '6 bulan',
      harga: 1500000,
      peserta: 5
    }
  ];

  updateStats(demoStats);
  loadPendaftarData(demoPendaftar);
  loadPesanData(demoPesan);
  loadKelasData(demoKelas);
}

// Update statistics
function updateStats(stats) {
  document.getElementById('total-pendaftar').textContent = stats.totalPendaftar;
  document.getElementById('kelas-aktif').textContent = stats.kelasAktif;
  document.getElementById('pendapatan').textContent = 'Rp' + stats.pendapatan.toLocaleString();
  document.getElementById('pesan-baru').textContent = stats.pesanBaru;
}

// Tab switching
function showTab(tabName) {
  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.add('hidden');
  });
  
  // Remove active class from all tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('border-[#e60012]', 'text-[#e60012]');
    btn.classList.add('border-transparent', 'text-gray-500');
  });
  
  // Show selected tab content
  document.getElementById(tabName + '-tab').classList.remove('hidden');
  
  // Add active class to clicked button
  event.target.classList.remove('border-transparent', 'text-gray-500');
  event.target.classList.add('border-[#e60012]', 'text-[#e60012]');
}

// Load pendaftar data
function loadPendaftarData(data) {
  const table = document.getElementById('pendaftar-table');
  table.innerHTML = '';
  
  data.forEach(pendaftar => {
    const row = document.createElement('tr');
    row.className = 'border-b border-gray-200 hover:bg-gray-50';
    row.innerHTML = `
      <td class="px-4 py-3">${pendaftar.nama}</td>
      <td class="px-4 py-3">${pendaftar.email}</td>
      <td class="px-4 py-3">${pendaftar.kelas}</td>
      <td class="px-4 py-3">
        <span class="px-2 py-1 text-xs rounded-full ${
          pendaftar.status === 'Terdaftar' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }">${pendaftar.status}</span>
      </td>
      <td class="px-4 py-3">${pendaftar.tanggal}</td>
      <td class="px-4 py-3">
        <button onclick="editPendaftar(${pendaftar.id})" class="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
        <button onclick="deletePendaftar(${pendaftar.id})" class="text-red-600 hover:text-red-800">Hapus</button>
      </td>
    `;
    table.appendChild(row);
  });
}

// Load pesan data
function loadPesanData(data) {
  const container = document.getElementById('pesan-list');
  container.innerHTML = '';
  
  data.forEach(pesan => {
    const card = document.createElement('div');
    card.className = 'bg-gray-50 rounded-lg p-4 border-l-4 border-[#e60012]';
    card.innerHTML = `
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-semibold">${pesan.nama}</h3>
        <span class="text-sm text-gray-500">${pesan.tanggal}</span>
      </div>
      <p class="text-gray-600 mb-2">${pesan.email}</p>
      <p class="text-gray-800">${pesan.pesan}</p>
      <div class="mt-3">
        <button onclick="replyPesan(${pesan.id})" class="text-[#e60012] hover:text-red-700 text-sm">Balas</button>
        <button onclick="deletePesan(${pesan.id})" class="text-red-600 hover:text-red-800 text-sm ml-4">Hapus</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Load kelas data
function loadKelasData(data) {
  const container = document.getElementById('kelas-list');
  container.innerHTML = '';
  
  data.forEach(kelas => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md p-6 card-hover';
    card.innerHTML = `
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-lg font-semibold text-[#e60012]">${kelas.nama}</h3>
        <div class="flex space-x-2">
          <button onclick="editKelas(${kelas.id})" class="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
          <button onclick="deleteKelas(${kelas.id})" class="text-red-600 hover:text-red-800 text-sm">Hapus</button>
        </div>
      </div>
      <p class="text-gray-600 mb-4">${kelas.deskripsi}</p>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="font-semibold">Durasi:</span> ${kelas.durasi}
        </div>
        <div>
          <span class="font-semibold">Harga:</span> Rp${kelas.harga.toLocaleString()}
        </div>
        <div>
          <span class="font-semibold">Peserta:</span> ${kelas.peserta || 0}
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Modal functions
function addKelas() {
  document.getElementById('modal-title').textContent = 'Tambah Kelas Baru';
  document.getElementById('kelas-form').reset();
  document.getElementById('kelas-modal').classList.remove('hidden');
  document.getElementById('kelas-modal').classList.add('flex');
}

function closeModal() {
  document.getElementById('kelas-modal').classList.add('hidden');
  document.getElementById('kelas-modal').classList.remove('flex');
}

// Form submission
document.getElementById('kelas-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const formData = {
    nama: document.getElementById('nama-kelas').value,
    deskripsi: document.getElementById('deskripsi-kelas').value,
    durasi: document.getElementById('durasi-kelas').value,
    harga: document.getElementById('harga-kelas').value
  };

  try {
    const response = await fetch('http://localhost:5000/api/admin/kelas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      loadDataFromServer(); // Reload all data
      closeModal();
      alert('Kelas berhasil ditambahkan!');
    } else {
      alert('Gagal menambahkan kelas');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Gagal menambahkan kelas');
  }
});

// Export data
async function exportData() {
  try {
    const response = await fetch('http://localhost:5000/api/admin/pendaftar');
    const data = await response.json();
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Nama,Email,Kelas,Status,Tanggal\n"
      + data.map(row => 
          `${row.nama},${row.email},${row.kelas},${row.status},${row.tanggal}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pendaftar_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting data:', error);
    alert('Gagal export data');
  }
}

// Action functions
function editPendaftar(id) {
  alert(`Edit pendaftar dengan ID: ${id}`);
}

async function deletePendaftar(id) {
  if (confirm('Yakin ingin menghapus pendaftar ini?')) {
    // In a real app, you would call DELETE endpoint
    alert('Fitur delete pendaftar akan diimplementasikan');
  }
}

function replyPesan(id) {
  alert(`Balas pesan dengan ID: ${id}`);
}

async function deletePesan(id) {
  if (confirm('Yakin ingin menghapus pesan ini?')) {
    // In a real app, you would call DELETE endpoint
    alert('Fitur delete pesan akan diimplementasikan');
  }
}

async function editKelas(id) {
  try {
    const response = await fetch(`http://localhost:5000/api/admin/kelas`);
    const kelasData = await response.json();
    const kelas = kelasData.find(k => k.id === id);
    
    if (kelas) {
      document.getElementById('modal-title').textContent = 'Edit Kelas';
      document.getElementById('nama-kelas').value = kelas.nama;
      document.getElementById('deskripsi-kelas').value = kelas.deskripsi;
      document.getElementById('durasi-kelas').value = kelas.durasi;
      document.getElementById('harga-kelas').value = kelas.harga;
      document.getElementById('kelas-modal').classList.remove('hidden');
      document.getElementById('kelas-modal').classList.add('flex');
    }
  } catch (error) {
    console.error('Error loading kelas data:', error);
    alert('Gagal memuat data kelas');
  }
}

async function deleteKelas(id) {
  if (confirm('Yakin ingin menghapus kelas ini?')) {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/kelas/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadDataFromServer(); // Reload all data
        alert('Kelas berhasil dihapus!');
      } else {
        alert('Gagal menghapus kelas');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal menghapus kelas');
    }
  }
}

function logout() {
  if (confirm('Yakin ingin logout?')) {
    window.location.href = 'index.html';
  }
} 