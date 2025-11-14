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
            <td class="border px-2 py-2 text-center">
              <input type="checkbox" class="pesan-checkbox" data-index="${index}">
            </td>
            <td class="border px-2 py-2">${index + 1}</td>
            <td class="border px-2 py-2">${pesan.nama}</td>
            <td class="border px-2 py-2">${pesan.email}</td>
            <td class="border px-2 py-2">${pesan.pesan}</td>
            <td class="border px-2 py-2">${pesan.tanggal || ''}</td>
            <td class="border px-2 py-2">
              <button class="delete-btn" data-index="${index}" style="color:red;">Delete</button>
            </td>
          `;
          tableBody.appendChild(row);
        });
        // Event select all
        const selectAll = document.getElementById('select-all-pesan');
        if (selectAll) {
          selectAll.checked = false;
          selectAll.addEventListener('change', function() {
            document.querySelectorAll('.pesan-checkbox').forEach(cb => {
              cb.checked = selectAll.checked;
            });
          });
        }
// Bulk Delete
async function bulkDeletePesan() {
  const checkboxes = document.querySelectorAll('.pesan-checkbox:checked');
  if (checkboxes.length === 0) {
    alert('Pilih pesan yang ingin dihapus!');
    return;
  }
  if (!confirm('Yakin ingin menghapus pesan terpilih?')) return;
  // Hapus dari index terbesar agar tidak bergeser
  const indices = Array.from(checkboxes).map(cb => parseInt(cb.getAttribute('data-index'))).sort((a,b)=>b-a);
  for (const idx of indices) {
    await deletePesan(idx);
  }
  loadPesan();
}

// Bulk Export
function bulkExportPesanToCSV() {
  const checkboxes = document.querySelectorAll('.pesan-checkbox:checked');
  if (checkboxes.length === 0) {
    alert('Pilih pesan yang ingin diexport!');
    return;
  }
  const data = window._pesanData || [];
  const indices = Array.from(checkboxes).map(cb => parseInt(cb.getAttribute('data-index')));
  const selected = indices.map(i => data[i]);
  const header = ['No', 'Nama', 'Email', 'Pesan', 'Tanggal'];
  const rows = selected.map((pesan, i) => [
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
  a.download = 'pesan_terpilih.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
        // Simpan data pesan ke window untuk export
        window._pesanData = data;

        // Make rows clickable to open detail modal
        document.querySelectorAll('#pesan-table-body tr').forEach((tr, i) => {
          // skip header placeholder rows
          const checkbox = tr.querySelector('.pesan-checkbox');
          if (!checkbox) return;
          tr.style.cursor = 'pointer';
          tr.addEventListener('click', (e) => {
            // if click on input or button, ignore to avoid double actions
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
            openPesanModal(parseInt(checkbox.getAttribute('data-index')));
          });
          // also add a small view button
          const actionCell = tr.querySelector('td:last-child');
          if (actionCell) {
            const viewBtn = document.createElement('button');
            viewBtn.textContent = 'View';
            viewBtn.className = 'mr-2 bg-gray-200 px-2 py-1 rounded text-sm';
            viewBtn.addEventListener('click', (ev) => {
              ev.stopPropagation();
              openPesanModal(parseInt(checkbox.getAttribute('data-index')));
            });
            actionCell.insertBefore(viewBtn, actionCell.firstChild);
          }
        });
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

// Filter messages based on search criteria
function filterPesan() {
  const nama = document.getElementById('filter-nama')?.value.toLowerCase() || '';
  const email = document.getElementById('filter-email')?.value.toLowerCase() || '';
  const dateFrom = document.getElementById('filter-date-from')?.value || '';
  const dateTo = document.getElementById('filter-date-to')?.value || '';
  
  const data = window._pesanData || [];
  const tableBody = document.getElementById('pesan-table-body');
  tableBody.innerHTML = '';

  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4">Belum ada pesan masuk</td></tr>`;
    return;
  }

  const filtered = data.filter((pesan, index) => {
    const pesanNama = (pesan.nama || '').toLowerCase();
    const pesanEmail = (pesan.email || '').toLowerCase();
    const pesanDate = pesan.tanggal || '';
    
    const matchNama = nama === '' || pesanNama.includes(nama);
    const matchEmail = email === '' || pesanEmail.includes(email);
    
    let matchDate = true;
    if (dateFrom || dateTo) {
      const pDate = new Date(pesanDate);
      if (dateFrom) {
        const fDate = new Date(dateFrom);
        matchDate = matchDate && pDate >= fDate;
      }
      if (dateTo) {
        const tDate = new Date(dateTo);
        tDate.setDate(tDate.getDate() + 1);
        matchDate = matchDate && pDate < tDate;
      }
    }

    return matchNama && matchEmail && matchDate;
  });

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4">Tidak ada pesan yang cocok</td></tr>`;
    return;
  }

  filtered.forEach((pesan, i) => {
    const originalIndex = data.indexOf(pesan);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="border px-2 py-2 text-center">
        <input type="checkbox" class="pesan-checkbox" data-index="${originalIndex}">
      </td>
      <td class="border px-2 py-2">${i + 1}</td>
      <td class="border px-2 py-2">${pesan.nama}</td>
      <td class="border px-2 py-2">${pesan.email}</td>
      <td class="border px-2 py-2">${pesan.pesan}</td>
      <td class="border px-2 py-2">${pesan.tanggal || ''}</td>
      <td class="border px-2 py-2">
        <button class="delete-btn" data-index="${originalIndex}" style="color:red;">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  // Re-attach delete handlers
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const idx = e.target.getAttribute('data-index');
      if (confirm('Yakin ingin menghapus pesan ini?')) {
        await deletePesan(idx);
      }
    });
  });
}

// Clear filters and reload all messages
function clearFilters() {
  document.getElementById('filter-nama').value = '';
  document.getElementById('filter-email').value = '';
  document.getElementById('filter-date-from').value = '';
  document.getElementById('filter-date-to').value = '';
  loadPesan();
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

// Modal handlers
function openPesanModal(index) {
  const data = window._pesanData || [];
  const p = data[index];
  if (!p) return;
  document.getElementById('modal-nama').textContent = p.nama || '-';
  document.getElementById('modal-email').textContent = p.email || '-';
  document.getElementById('modal-tanggal').textContent = p.tanggal || '-';
  document.getElementById('modal-pesan').textContent = p.pesan || '-';
  const modal = document.getElementById('pesan-modal');
  modal.classList.remove('hidden');
}

function closePesanModal() {
  const modal = document.getElementById('pesan-modal');
  modal.classList.add('hidden');
}

// copy email
function copyModalEmail() {
  const email = document.getElementById('modal-email').textContent || '';
  if (!email) return;
  navigator.clipboard.writeText(email).then(() => {
    alert('Email disalin ke clipboard');
  }).catch(() => {
    alert('Gagal menyalin email');
  });
}

// Reply via mailto: opens default mail client with prefilled subject and body
function replyModalEmail() {
  const email = document.getElementById('modal-email').textContent || '';
  const nama = document.getElementById('modal-nama').textContent || '';
  const pesan = document.getElementById('modal-pesan').textContent || '';
  if (!email) {
    alert('Email tidak tersedia');
    return;
  }
  const subject = `Balasan untuk pesan Anda`;
  const body = `Halo ${nama},%0D%0A%0D%0ATerima kasih telah menghubungi kami. Berikut adalah ringkasan pesan Anda:%0D%0A%0D%0A${encodeURIComponent(pesan)}%0D%0A%0D%0AMohon balas jika ada pertanyaan.`;
  const mailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${body}`;
  window.location.href = mailto;
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
  const bulkDeleteBtn = document.getElementById('bulk-delete-btn');
  if (bulkDeleteBtn) bulkDeleteBtn.addEventListener('click', bulkDeletePesan);
  const bulkExportBtn = document.getElementById('bulk-export-btn');
  if (bulkExportBtn) bulkExportBtn.addEventListener('click', bulkExportPesanToCSV);
  const modalClose = document.getElementById('modal-close-btn');
  if (modalClose) modalClose.addEventListener('click', closePesanModal);
  const modalClose2 = document.getElementById('modal-close-btn-2');
  if (modalClose2) modalClose2.addEventListener('click', closePesanModal);
  const modalCopy = document.getElementById('modal-copy-email');
  if (modalCopy) modalCopy.addEventListener('click', copyModalEmail);
  const modalReply = document.getElementById('modal-reply');
  if (modalReply) modalReply.addEventListener('click', replyModalEmail);
  // Filter events
  const filterApply = document.getElementById('filter-apply-btn');
  if (filterApply) filterApply.addEventListener('click', filterPesan);
  const filterClear = document.getElementById('filter-clear-btn');
  if (filterClear) filterClear.addEventListener('click', clearFilters);
  // Real-time filter on input (optional, comment out if too slow)
  const filterInputs = ['filter-nama', 'filter-email', 'filter-date-from', 'filter-date-to'];
  filterInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('keyup', filterPesan);
  });
  // close modal on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePesanModal();
  });
});
