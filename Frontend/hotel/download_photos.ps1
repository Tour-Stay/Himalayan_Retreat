$galleryDir = 'c:\Users\deepa\Himalayan_Retreat\Frontend\hotel\public\images\gallery'

if (-not (Test-Path $galleryDir)) {
    New-Item -ItemType Directory -Force -Path $galleryDir
}

$photos = @(
    @{
        Name = 'night_terrace_lights.jpg'
        Url  = 'https://lh3.googleusercontent.com/grass-cs/AABkmLdJ3Q-uA4ZBOjTdelZZ2X3HgjOZluA3kcVCC-T8hOVVokp8FxABRAomuBG7FbVkIX-DzyUxqXrD7Wg3E9H4N5gks1ff9PikUpMN8ccyhFR8v2thHi2Y6fxrjjuoVPrP2GgnKXIp=w1600-h1200-k-no'
    },
    @{
        Name = 'day_exterior_chalets.jpg'
        Url  = 'https://lh3.googleusercontent.com/gps-cs-s/ANWiy9SMxAfrFrZXk88m8kfLp2Pn97SDW-Wr3B8eYEcKUSLFIDq8vd11WyxWi1o_irNI0cgsgVp33xvcH9OVoDHbPYhlxBrCXN6bfMwTHIycHc3CS-agI0LCXH5Gdro1Hlg1TbcU7Eq3YA=w1600-h1200-k-no'
    },
    @{
        Name = 'suite_snow_peaks_view.jpg'
        Url  = 'https://lh3.googleusercontent.com/gps-cs-s/ANWiy9S3qA55gJGCK0ivu_PerHESb2kkpaQgzpQwdoN6DTTE0uO6bqQVBvXYhIEpVv1eEl-xqPrvfmapdnXdQnDYrkpBE4MVTPk_2Ol_BDNEJdscL7WV6qZzxpGVx6OBmdPc4EyLKC_X=w1600-h1200-k-no'
    },
    @{
        Name = 'mountain_ridge_panoramic.jpg'
        Url  = 'https://lh3.googleusercontent.com/gps-cs-s/ANWiy9SqMVxbaNgM7UKhQbrHr3opSKYnVwrGV7SRdC2dHGhBpk05aLJPTYgZNOfXo4592WOMG6BGcvRa2OXPfYqTV7dfOJTyliqfHAJRG4FzlZbEKVpgl0gq-omS7yl1lvgegrg_p0QWPg=w1600-h1200-k-no'
    }
)

foreach ($p in $photos) {
    $out = Join-Path $galleryDir $p.Name
    try {
        Write-Host "Downloading $($p.Name)..."
        Invoke-WebRequest -Uri $p.Url -OutFile $out -TimeoutSec 30
        Write-Host "Downloaded $($p.Name) successfully"
    } catch {
        Write-Host "Failed to download $($p.Name): $_"
    }
}

Get-ChildItem $galleryDir | Select-Object Name, Length
