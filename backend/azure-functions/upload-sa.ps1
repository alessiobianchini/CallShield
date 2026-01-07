# Upload a Firestore service account JSON to /home/site/wwwroot on your Function App.
# Usage (PowerShell):
#   $env:FUNCTION_APP_NAME="callshield-api"
#   $env:FUNCTION_APP_RG="my-resource-group"
#   $env:SA_JSON_PATH="D:\Git\Ale\CallShield\backend\azure-functions\callshield-sa.json"
#   ./upload-sa.ps1
#
# Requires: az CLI logged in.

param()

$funcName = $env:FUNCTION_APP_NAME
$resourceGroup = $env:FUNCTION_APP_RG
$jsonPath = $env:SA_JSON_PATH

if (-not $funcName) { Write-Error "Set FUNCTION_APP_NAME (e.g., callshield-api)"; exit 1 }
if (-not $resourceGroup) { Write-Error "Set FUNCTION_APP_RG (resource group name)"; exit 1 }
if (-not $jsonPath) { Write-Error "Set SA_JSON_PATH to the service account JSON path"; exit 1 }
if (-not (Test-Path $jsonPath)) { Write-Error "File not found: $jsonPath"; exit 1 }

$uploadUrl = "https://$funcName.scm.azurewebsites.net/api/vfs/site/wwwroot/callshield-sa.json"

# Prefer AAD bearer token (works even if basic publishing creds are disabled).
Write-Host "Requesting AAD token for Kudu..."
$token = az account get-access-token --resource https://management.azure.com/ --query accessToken -o tsv 2>$null
$useBearer = $token -and $token.Trim().Length -gt 0

if ($useBearer) {
  $headers = @{ Authorization = "Bearer $token" }
} else {
  Write-Host "Fallback to publishing credentials..."
  $profileJson = az webapp deployment list-publishing-profiles --name $funcName --resource-group $resourceGroup -o json
  if (!$profileJson) { Write-Error "Could not fetch publishing profile. Check az login / names."; exit 1 }
  $profile = $profileJson | ConvertFrom-Json | Where-Object { $_.publishMethod -eq "ZipDeploy" } | Select-Object -First 1
  if (-not $profile) { $profile = ($profileJson | ConvertFrom-Json)[0] }
  $user = $profile.userName
  $pass = $profile.userPWD
  if (-not $user -or -not $pass) { Write-Error "Publishing credentials not found."; exit 1 }
  $pair = [System.Text.Encoding]::ASCII.GetBytes("$($user):$($pass)")
  $auth = [System.Convert]::ToBase64String($pair)
  $headers = @{ Authorization = "Basic $auth" }
  $credential = New-Object System.Management.Automation.PSCredential($user, (ConvertTo-SecureString $pass -AsPlainText -Force))
}

Write-Host "Uploading $jsonPath to $uploadUrl ..."
try {
  if ($credential) {
    Invoke-WebRequest -UseBasicParsing -Uri $uploadUrl -Method Put -Credential $credential -ContentType "application/octet-stream" -InFile $jsonPath -ErrorAction Stop
  } else {
    Invoke-WebRequest -UseBasicParsing -Uri $uploadUrl -Method Put -Headers $headers -ContentType "application/octet-stream" -InFile $jsonPath -ErrorAction Stop
  }
} catch {
  if ($useBearer) {
    Write-Warning "Bearer upload failed; retrying with publishing credentials..."
    $profileJson = az webapp deployment list-publishing-profiles --name $funcName --resource-group $resourceGroup -o json
    if ($profileJson) {
      $profileObj = $profileJson | ConvertFrom-Json
      $profile = $profileObj | Where-Object { $_.publishMethod -eq "ZipDeploy" } | Select-Object -First 1
      if (-not $profile) { $profile = $profileObj[0] }
      $user = $profile.userName
      $pass = $profile.userPWD
      $pair = [System.Text.Encoding]::ASCII.GetBytes("$($user):$($pass)")
      $auth = [System.Convert]::ToBase64String($pair)
      $headers = @{ Authorization = "Basic $auth" }
      $securePass = ConvertTo-SecureString ($pass | Out-String).Trim() -AsPlainText -Force
      $credential = New-Object System.Management.Automation.PSCredential($user, $securePass)
      Invoke-WebRequest -UseBasicParsing -Uri $uploadUrl -Method Put -Credential $credential -ContentType "application/octet-stream" -InFile $jsonPath -ErrorAction Stop
    } else {
      throw
    }
  } else {
    throw
  }
}
Write-Host "Done. Set app setting GOOGLE_APPLICATION_CREDENTIALS to /home/site/wwwroot/callshield-sa.json and restart the Function App."
