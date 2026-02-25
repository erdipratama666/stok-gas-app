// Simple test untuk API /api/stok dengan action masuk
async function testGasMasuk() {
  try {
    console.log('Testing API /api/stok dengan action: masuk');
    const response = await fetch('http://localhost:3001/api/stok', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'masuk',
        tipe: 'isi',
        jumlah: 5,
        keterangan: 'Test masuk'
      })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    
    if (response.status === 200 || response.status === 500) {
      console.log(data);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

testGasMasuk();
