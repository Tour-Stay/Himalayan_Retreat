$mapsDir = 'c:\Users\deepa\Himalayan_Retreat\Frontend\hotel\public\images\maps'

$images = @(
    @{
        Name = 'trishul_peaks_hd.jpg'
        Url  = 'https://lh3.googleusercontent.com/gps-cs-s/ANWiy9RX96bGvxai-J-Kev1FptrSwTb1bfsuyECyii9K3o81gt1UzetCUBap8OLCjtYY-sQKPpZ5M0TstT2-ffZXzq1wM1I0xdEX3r5ip48qfQeZYg0rAJQnAvuqDvIfsFWY2YWWjgAMR79wBSoB=w2048-h1365-k-no'
    },
    @{
        Name = 'hotel_winter_snow_hd.jpg'
        Url  = 'https://lh3.googleusercontent.com/gps-cs-s/ANWiy9RFceZWssj5-xHuK7Fv5GTqXQR2Zy3huc38b9MFsqmCVg0bCSBny3eW2cwiWreccsiuqzx_l_afCbF1UIKO2M88A9ucAtggnHvJ75tECOfy4lVvrNn8SU3OKdkjYrvz86To6Rmq=w2048-h1365-k-no'
    },
    @{
        Name = 'kasar_snow_hills_hd.jpg'
        Url  = 'https://lh3.googleusercontent.com/gps-cs-s/ANWiy9SEhbVrgGykGXC_OZv11Y5ZmpRiqMc1Toi6cYdLxslp25X5_IZBUUD1kDeVX-jKhNlnK50nowOs-WRP00zL4GTfYqfgceGQJpcWmP_HO6i6_jtWbiIFFLRHQNiyEbow57rg9zZwdw=w2048-h1365-k-no'
    }
)

foreach ($img in $images) {
    $dest = Join-Path $mapsDir $img.Name
    Write-Host "Downloading $($img.Name)..."
    try {
        Invoke-WebRequest -Uri $img.Url -OutFile $dest -TimeoutSec 30
        Write-Host "Success: $($img.Name) ($((Get-Item $dest).Length) bytes)"
    } catch {
        Write-Host "Error downloading $($img.Name): $_"
    }
}
