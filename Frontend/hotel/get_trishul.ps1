$mapsDir = 'c:\Users\deepa\Himalayan_Retreat\Frontend\hotel\public\images\maps'
$trishulUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Trisul%2C_Nanda_Devi_and_Himalayan_range_from_Kausani%2C_Uttarakhand.jpg/1280px-Trisul%2C_Nanda_Devi_and_Himalayan_range_from_Kausani%2C_Uttarakhand.jpg'
$trishulOut = Join-Path $mapsDir 'trishul_nanda_devi_hd.jpg'

Write-Host "Downloading Trishul & Nanda Devi 1280px..."
try {
    Invoke-WebRequest -Uri $trishulUrl -OutFile $trishulOut -UserAgent 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0' -TimeoutSec 45
    Write-Host "Downloaded Trishul HD: $((Get-Item $trishulOut).Length) bytes"
} catch {
    Write-Host "Failed: $_"
}
