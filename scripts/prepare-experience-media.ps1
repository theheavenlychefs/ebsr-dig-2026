param(
  [Parameter(Mandatory = $true)][string]$SourceDirectory,
  [string]$Ffmpeg = "ffmpeg"
)

$ErrorActionPreference = "Stop"
$assets = (Resolve-Path (Join-Path $PSScriptRoot "../public/assets")).Path
$clips = @(
  @{ Source = "The Word.mp4"; Name = "word"; Start = 54; Width = 360; PosterTime = 2 },
  @{ Source = "Needed.mp4"; Name = "fellowship"; Start = 7; Width = 540; PosterTime = 0.5 },
  @{ Source = "Memories2.mp4"; Name = "memories"; Start = 0; Width = 368; PosterTime = 3 }
)

foreach ($clip in $clips) {
  $source = (Resolve-Path -LiteralPath (Join-Path $SourceDirectory $clip.Source)).Path
  $video = Join-Path $assets ("experience-" + $clip.Name + ".mp4")
  $poster = Join-Path $assets ("experience-" + $clip.Name + "-poster.webp")
  # These approved excerpts are upright. Never overwrite or rotate the originals.
  & $Ffmpeg -hide_banner -loglevel error -y -ss $clip.Start -i $source -t 12 `
    -map 0:v:0 -map "0:a:0?" -vf ("fps=30,scale=" + $clip.Width + ":-2,setsar=1") `
    -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -c:a aac -b:a 96k `
    -map_metadata -1 -movflags +faststart $video
  if ($LASTEXITCODE -ne 0) { throw "Encoding failed: $($clip.Source)" }
  & $Ffmpeg -hide_banner -loglevel error -y -ss $clip.PosterTime -i $video `
    -frames:v 1 -c:v libwebp -quality 88 $poster
  if ($LASTEXITCODE -ne 0) { throw "Poster extraction failed: $($clip.Source)" }
  Get-Item -LiteralPath $video, $poster | Select-Object Name, Length
}
