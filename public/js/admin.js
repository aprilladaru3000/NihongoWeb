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
      `;
      tableBody.appendChild(row);
    });

  } catch (err) {
    console.error('Gagal memuat pesan:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadPesan);
setInterval(loadPesan, 10000);
