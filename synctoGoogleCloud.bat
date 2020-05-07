:: This is a comment. Run the command as
:: powershell ./synctoGoogleCloud.bat
:: Only works for first line. Might as well copy paste

gsutil -m rsync -r assets gs://mtech-ai-pioneers-iisc/assets
Write-Host –NoNewLine "First Line Done"
gsutil -m rsync -r content gs://mtech-ai-pioneers-iisc/content
Write-Host –NoNewLine "Second Line Done"
gsutil cp index.html gs://mtech-ai-pioneers-iisc
Write-Host –NoNewLine "Third Line Done"
