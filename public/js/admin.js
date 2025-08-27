async function loadPesan() {
  try {
    const res = await fetch('/api/admin/pesan');
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    
    const data = await res.json();
    console.log('Data pesan masuk:', data);

    const tableBody = document.getElementById('pesan-table-body');
    tableBody.innerHTML = '';

    if (!Array.isArray(data) || data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4">Belum ada pesan masuk</td></tr>`;
      return;
    }

        data.forEach((pesan, index) => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td class="border px-4 py-2">${index + 1}</td>
            <td class="border px-4 py-2">${pesan.nama}</td>
            <td class="border px-4 py-2">${pesan.email}</td>
            <td class="border px-4 py-2">${pesan.pesan}</td>
            <td class="border px-4 py-2">${pesan.tanggal || ''}</td>
            <td class="border px-4 py-2">
              <button class="delete-btn" data-index="${index}" style="color:red;">Delete</button>
            </td>
          `;
          tableBody.appendChild(row);
        });
        // Simpan data pesan ke window untuk export
        window._pesanData = data;
// Export data pesan ke CSV
function exportPesanToCSV() {
  const data = window._pesanData || [];
  if (!data.length) {
    alert('Tidak ada data untuk diexport!');
    return;
  }
  const header = ['No', 'Nama', 'Email', 'Pesan', 'Tanggal'];
  const rows = data.map((pesan, i) => [
    i + 1,
    '"' + (pesan.nama || '').replace(/"/g, '""') + '"',
    '"' + (pesan.email || '').replace(/"/g, '""') + '"',
    '"' + (pesan.pesan || '').replace(/"/g, '""') + '"',
    '"' + (pesan.tanggal || '') + '"'
  ]);
  let csv = header.join(',') + '\n' + rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pesan_masuk.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

    // Tambahkan event listener untuk tombol delete
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const idx = e.target.getAttribute('data-index');
        if (confirm('Yakin ingin menghapus pesan ini?')) {
          await deletePesan(idx);
        }
      });
    });

  } catch (err) {
    console.error('Gagal memuat pesan:', err);
  }
}


async function deletePesan(index) {
  try {
    const res = await fetch(`/api/admin/pesan/${index}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Gagal menghapus pesan');
    loadPesan();
  } catch (err) {
    alert('Terjadi kesalahan saat menghapus pesan.');
    console.error(err);
  }
}


async function loadStatistik() {
  try {
    const res = await fetch('/api/admin/statistik');
    if (!res.ok) throw new Error('Gagal memuat statistik');
    const data = await res.json();
    document.getElementById('statistik-pesan').textContent = data.totalPesan;
    document.getElementById('statistik-visitor').textContent = data.totalVisitors;
  } catch (err) {
    console.error('Gagal memuat statistik:', err);
  }
}

function loadAll() {
  loadPesan();
  loadStatistik();
}

document.addEventListener('DOMContentLoaded', loadAll);
setInterval(loadAll, 10000);

// Event export CSV
document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('export-csv-btn');
  if (btn) btn.addEventListener('click', exportPesanToCSV);
});
