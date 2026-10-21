Add-Type -AssemblyName System.Drawing

$src = 'C:\Users\deepa\.gemini\antigravity-ide\brain\a11c948e-9654-4393-96a3-bcda7b3b978f\instagram_after_close_1792488956456.png'
$bmp = [System.Drawing.Bitmap]::FromFile($src)
$galleryDir = 'c:\Users\deepa\Himalayan_Retreat\Frontend\hotel\public\images\gallery'

if (-not (Test-Path $galleryDir)) {
    New-Item -ItemType Directory -Force -Path $galleryDir
}

function Crop-Image($x, $y, $w, $h, $destName) {
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $cropped = $bmp.Clone($rect, $bmp.PixelFormat)
    $outPath = Join-Path $galleryDir $destName
    $cropped.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $cropped.Dispose()
    Write-Host "Successfully saved $destName"
}

# 1. Post 1: Satya's Roof Top Cafe banner with Tibetan prayer flags among Kasar pines
Crop-Image 297 570 304 160 'satyas_rooftop_cafe.jpg'

# 2. Post 3: Guest gazing at mountain peaks at sunset ("pahadon ke peeche wali duniya")
Crop-Image 917 570 304 160 'guest_mountain_sunset.jpg'

# 3. Highlight 2: Group of travelers/guests on Kasar ridge
Crop-Image 470 488 88 88 'guests_group_ridge.jpg'

# 4. Highlight 4: Traveler playing guitar on the open mountain terrace
Crop-Image 734 488 88 88 'acoustic_guitar_deck.jpg'

# 5. Highlight 1: "I LOVE KASAR" cafe terrace
Crop-Image 340 488 88 88 'ilove_kasar_terrace.jpg'

$bmp.Dispose()

# Also crop the snow chalets and pines profile photo from instagram_page_1792487889450.png
$src2 = 'C:\Users\deepa\.gemini\antigravity-ide\brain\a11c948e-9654-4393-96a3-bcda7b3b978f\instagram_page_1792487889450.png'
if (Test-Path $src2) {
    $bmp2 = [System.Drawing.Bitmap]::FromFile($src2)
    $rect2 = New-Object System.Drawing.Rectangle(720, 268, 95, 95)
    $cropped2 = $bmp2.Clone($rect2, $bmp2.PixelFormat)
    $cropped2.Save((Join-Path $galleryDir 'kasar_snow_pines_chalet.jpg'), [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $cropped2.Dispose()
    $bmp2.Dispose()
    Write-Host "Successfully saved kasar_snow_pines_chalet.jpg"
}

Get-ChildItem $galleryDir
