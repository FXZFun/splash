param (
    [string]$browser = "chrome",
    [string]$version = "3.0"
)


# Set the permissions and version number
$manifestContent = Get-Content -Path "manifest.json" -Raw
if ($browser -Eq "chrome") {
    $permissions = '"optional_permissions": ["favicon", "topSites"],'
} elseif ($browser -Eq "firefox") {
    $permissions = '"permissions": ["topSites"], "browser_specific_settings": { "gecko": { "id": "splash-new-tab@fxzfun.com" } },'
}
$newManifestContent = $manifestContent -replace '"---PERMISSIONS---": {},', $permissions
$newManifestContent = $newManifestContent -replace '---VERSION---', $version
$newManifestContent | Set-Content -Path "manifest.json"


# Set the list of backgrounds in newtab.js
$backgrounds = Get-ChildItem -Path "backgrounds" -File | Select-Object -ExpandProperty Name
$jsonArray = $backgrounds | ConvertTo-Json
$newtabContent = Get-Content -Path "newtab.js" -Raw
$newContent = $newtabContent -replace '\["---BACKGROUNDS---"\]', $jsonArray
$newContent | Set-Content -Path "newtab.js"


# Create zip artifact
$sourceFolder = "../splash"
$destinationZip = "../splash/releases/splash-" + $version + "-" + $browser + ".zip"
$excludeFiles = @(".gitignore", "deploy.ps1")
$excludeFolders = @(".git", ".github", "releases")

if (Test-Path $sourceFolder) {
    $tempFolder = Join-Path $env:TEMP ("TempZip" + [System.Guid]::NewGuid().ToString())
    Copy-Item -Path $sourceFolder -Destination $tempFolder -Recurse -Force

    foreach ($excludeFile in $excludeFiles) {
        $excludePath = Join-Path $tempFolder $excludeFile
        if (Test-Path $excludePath -PathType Leaf) {
            Remove-Item $excludePath -Force
        }
    }

    foreach ($excludeFolder in $excludeFolders) {
        $excludePath = Join-Path $tempFolder $excludeFolder
        if (Test-Path $excludePath -PathType Container) {
            Remove-Item $excludePath -Recurse -Force
        }
    }

    Compress-Archive -Path $tempFolder\* -DestinationPath $destinationZip -Force

    Remove-Item $tempFolder -Recurse -Force

    Write-Host "created zip release"
} else {
    Write-Host "error: source folder does not exist"
}


# Update git repository
git restore manifest.json
git restore newtab.js
git add "releases/splash-$version-$browser.zip"
git commit -m "build release version $version for $browser"
