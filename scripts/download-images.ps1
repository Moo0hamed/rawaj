$ErrorActionPreference = "Stop"
$dir = Join-Path $PSScriptRoot "..\public\images"
New-Item -ItemType Directory -Path $dir -Force | Out-Null

$images = @(
  @{ id = "1522071820081-009f0129c71c"; name = "hero-team"; w = 1400 },
  @{ id = "1552664730-d307ca884978"; name = "about-team"; w = 1200 },
  @{ id = "1497366216548-37526070297c"; name = "about-office"; w = 1200 },
  @{ id = "1460925895917-afdab827c52f"; name = "service-digital-marketing"; w = 1400 },
  @{ id = "1611162617474-5b21e879e113"; name = "service-social-media"; w = 1400 },
  @{ id = "1574717024653-61fd2cf4d44d"; name = "service-content"; w = 1400 },
  @{ id = "1492691527719-9d1e07e534b4"; name = "service-photo"; w = 1400 },
  @{ id = "1626785774573-4b799315345d"; name = "service-branding"; w = 1400 },
  @{ id = "1533750516457-a7f992034fec"; name = "service-ads"; w = 1400 },
  @{ id = "1495474472287-4d71bcdd2085"; name = "project-qahwa-cover"; w = 1600 },
  @{ id = "1442512595331-e89e73853f31"; name = "project-qahwa-1"; w = 1200 },
  @{ id = "1554118811-1e0d58224f24"; name = "project-qahwa-2"; w = 1200 },
  @{ id = "1556228720-195a672e8a03"; name = "project-lumi-cover"; w = 1600 },
  @{ id = "1571781926291-c477ebfd024b"; name = "project-lumi-1"; w = 1200 },
  @{ id = "1598440947619-2c35fc9aa908"; name = "project-lumi-2"; w = 1200 },
  @{ id = "1560518883-ce09059eeffa"; name = "project-ofoq-cover"; w = 1600 },
  @{ id = "1512917774080-9991f1c4c750"; name = "project-ofoq-1"; w = 1200 },
  @{ id = "1600585154340-be6161a56a0c"; name = "project-ofoq-2"; w = 1200 },
  @{ id = "1534438327276-14e5300c3a48"; name = "project-nabd-cover"; w = 1600 },
  @{ id = "1517836357463-d25dfeac3438"; name = "project-nabd-1"; w = 1200 },
  @{ id = "1571019613454-1cb2f99b2d8b"; name = "project-nabd-2"; w = 1200 },
  @{ id = "1441986300917-64674bd600d8"; name = "project-dar-cover"; w = 1600 },
  @{ id = "1490481651871-ab68de25d43d"; name = "project-dar-1"; w = 1200 },
  @{ id = "1483985988355-763728e1935b"; name = "project-dar-2"; w = 1200 },
  @{ id = "1517248135467-4c7edcad34c4"; name = "project-mada-cover"; w = 1600 },
  @{ id = "1414235077428-338989a2e8c0"; name = "project-mada-1"; w = 1200 },
  @{ id = "1552566626-52f8b828add9"; name = "project-mada-2"; w = 1200 },
  @{ id = "1560250097-0b93528c311a"; name = "team-ahmed"; w = 900 },
  @{ id = "1573497019940-1c28c88b4f3e"; name = "team-sara"; w = 900 },
  @{ id = "1507003211169-0a1dd7228f2d"; name = "team-youssef"; w = 900 },
  @{ id = "1580489944761-15a19d654956"; name = "team-mariam"; w = 900 },
  @{ id = "1519085360753-af0119f7cbe7"; name = "team-karim"; w = 900 }
)

foreach ($img in $images) {
  $out = Join-Path $dir ($img.name + ".jpg")
  if (Test-Path -LiteralPath $out) {
    Write-Output ("skip  " + $img.name)
    continue
  }
  $url = "https://images.weserv.nl/?url=images.unsplash.com/photo-" + $img.id + "&w=" + $img.w + "&output=jpg&q=80&af&il"
  try {
    Invoke-WebRequest -Uri $url -OutFile $out -TimeoutSec 60 -UseBasicParsing | Out-Null
    $size = (Get-Item -LiteralPath $out).Length
    Write-Output ("ok    " + $img.name + " (" + [math]::Round($size/1024) + " KB)")
  } catch {
    Write-Output ("FAIL  " + $img.name + " -> " + $_.Exception.Message)
  }
}
