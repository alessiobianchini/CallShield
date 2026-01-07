# Usage:
#   cd backend/azure-functions
#   $env:FUNCTION_APP_NAME="callshield-api"
#   $env:FIRESTORE_KEY_FILE="callshield-sa.json"   # path to your service account JSON in this folder
#   ./deploy.ps1
#
# Prereqs: Azure CLI (`az`) logged in, Azure Functions Core Tools (`func`), Node 18+, and `npm`.

param()

if (-not $env:FUNCTION_APP_NAME) {
  Write-Error "Set FUNCTION_APP_NAME to your Azure Function App name (e.g., callshield-api)."
  exit 1
}

$funcName = $env:FUNCTION_APP_NAME
$keyFile = if ($env:FIRESTORE_KEY_FILE) { $env:FIRESTORE_KEY_FILE } else { "callshield-sa.json" }

if (-not (Test-Path $keyFile)) {
  Write-Error "Service account JSON not found at '$keyFile'. Set FIRESTORE_KEY_FILE or place the file here."
  exit 1
}

Write-Host "Installing npm dependencies..."
npm install
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Deploying to Azure Function App '$funcName'..."
func azure functionapp publish $funcName --nozip
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Uploading service account JSON to /home/site/wwwroot/$keyFile ..."
$rg = az resource show --name $funcName --resource-type Microsoft.Web/sites --query resourceGroup -o tsv
$profileJson = az webapp deployment list-publishing-profiles --name $funcName --resource-group $rg --output json
$pubUser = ($profileJson | ConvertFrom-Json)[0].userName
$pubPass = ($profileJson | ConvertFrom-Json)[0].userPWD
$uploadUrl = "https://$funcName.scm.azurewebsites.net/api/vfs/site/wwwroot/$keyFile"

& curl.exe -X PUT -u "$pubUser`:$pubPass" `
  -H "Content-Type: application/octet-stream" `
  --data-binary "@$keyFile" `
  $uploadUrl

Write-Host "Set the app setting GOOGLE_APPLICATION_CREDENTIALS to /home/site/wwwroot/$keyFile if not already set."
Write-Host "Done."
