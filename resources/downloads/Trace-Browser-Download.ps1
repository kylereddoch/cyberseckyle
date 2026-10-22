<#
.SYNOPSIS
Find Chrome and Edge download records within one selected Windows user profile.
.NOTES
Author: Kyle Reddoch (CybersecKyle)
Website: https://www.kylereddoch.me
Version: 1.1-standalone
Requires elevated Windows PowerShell 5.1 x64 and built-in winsqlite3.dll.
Standalone adaptation: not yet validated on Windows endpoints. Test in a lab first.
.DESCRIPTION
Reads source files and queries working copies; never deletes source journals.
Retains sidecars and provisional journal checks. Header checks and quick_check
cannot establish an atomic snapshot. Do not bypass collection/recovery errors.
Reports and console output may identify people or systems; copies contain broader
browser history. Protect all output. Records do not prove execution, a person's
actions, or a complete delivery route. Zero matches is not a clean verdict.
.PARAMETER ProfilePath
Required local Windows profile path. Searches standard Chrome/Edge locations only.
.PARAMETER FileName
Required filename (4-255 characters). Substring search across path and URL/context
fields, including referrers; inspect matches rather than assuming exact filenames.
.PARAMETER OutputRoot
Report parent folder; defaults under ProgramData. New run folders restrict access
to SYSTEM/Administrators. Parent folder permissions are unchanged.
.PARAMETER MaxMatchesPerDatabase
Retain up to 1000 matches per database by default. Truncation means incomplete coverage.
.PARAMETER MaxDatabaseSetMB
Database-set limit in MiB (default 1024); also enforced per file during copying.
.PARAMETER KeepWorkingCopies
Retain sensitive working copies. Otherwise attempt cleanup; reports remain.
.EXAMPLE
.\Trace-Browser-Download.ps1 -ProfilePath '<SELECTED_WINDOWS_PROFILE>' -FileName '<INSTALLER_FILENAME>'
Replace placeholders with authorized values. Run as a script; do not dot-source.
.OUTPUTS
Console summary and restricted local reports. Exit 0: available sources completed;
exit 2: incomplete/failed collection. Preflight failures may prevent reports.
Guard rejections count as Error, not a separate skip count. NotPresent is not a
database count. Cleanup failures may leave sensitive working copies behind.
#>
#requires -Version 5.1
#requires -RunAsAdministrator
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$ProfilePath,

    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$FileName,

    [ValidateNotNullOrEmpty()]
    [string]$OutputRoot = "$env:ProgramData\BrowserDownloadTrace",

    [ValidateRange(1, 10000)]
    [int]$MaxMatchesPerDatabase = 1000,

    [ValidateRange(1, 4096)]
    [int]$MaxDatabaseSetMB = 1024,

    [switch]$KeepWorkingCopies
)

Set-StrictMode -Version 2.0
$ErrorActionPreference = 'Stop'

# Result reporting also covers failures. Console output is minimized, not anonymous.
$TraceExitCode = 2
$TraceStage = 'preflight'
$TraceFailureType = $null
$TraceCollectionStarted = $false
$TraceReportsWritten = $false
$TraceReportFolder = '(not created or not verified)'
try {
if ($env:OS -ne 'Windows_NT') { throw 'Windows is required.' }
if ($PSVersionTable.PSVersion.Major -ne 5 -or $PSVersionTable.PSVersion.Minor -ne 1) { throw 'Use Windows PowerShell 5.1 (powershell.exe), not PowerShell 7/pwsh.' }
if (-not [Environment]::Is64BitProcess) {
    throw 'Use a 64-bit Windows PowerShell 5.1 process.'
}
if ($FileName.Length -lt 4 -or $FileName.Length -gt 255 -or $FileName.IndexOfAny([IO.Path]::GetInvalidFileNameChars()) -ge 0) {
    throw 'FileName must be a specific filename (4-255 characters), without path separators or invalid filename characters.'
}
# Require local, absolute paths. Never resolve to a network share as SYSTEM.
function Get-LocalPath([string]$Path) {
    if ($Path -notmatch '^[A-Za-z]:\\' -or $Path.Contains('::')) { throw "A local absolute drive path is required: $Path" }
    $full = [IO.Path]::GetFullPath($Path)
    $drive = New-Object IO.DriveInfo -ArgumentList ([IO.Path]::GetPathRoot($full))
    if ($drive.DriveType -eq [IO.DriveType]::Network) { throw 'Mapped network drives are not supported.' }
    if ($full.Length -gt 3) { $full = $full.TrimEnd('\') }
    return $full
}
$ProfilePath = Get-LocalPath $ProfilePath
$OutputRoot = Get-LocalPath $OutputRoot
if (-not (Test-Path -LiteralPath $ProfilePath -PathType Container)) { throw "Profile folder does not exist: $ProfilePath" }
$SqliteDll = Join-Path ([Environment]::SystemDirectory) 'winsqlite3.dll'
if (-not (Test-Path -LiteralPath $SqliteDll -PathType Leaf)) { throw "Built-in SQLite is unavailable: $SqliteDll. Nothing will be downloaded." }
# Reject existing junctions/symlinks in traversed paths, particularly output paths.
function Assert-NoReparse([string]$Path) {
    $p = [IO.Path]::GetFullPath($Path)
    while ($p) {
        if (Test-Path -LiteralPath $p) {
            $item = Get-Item -LiteralPath $p -Force
            if (($item.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { throw "Reparse point not followed: $p" }
        }
        $parent = [IO.Directory]::GetParent($p)
        if ($null -eq $parent) { break }
        $p = $parent.FullName
    }
}
Assert-NoReparse $ProfilePath
Assert-NoReparse $OutputRoot
$RunId = '{0}_{1}_{2}' -f $env:COMPUTERNAME, [DateTime]::UtcNow.ToString('yyyyMMddTHHmmssZ'), [Guid]::NewGuid().ToString('N')
$RunDir = Join-Path $OutputRoot $RunId
if (Test-Path -LiteralPath $RunDir) { throw 'Run directory already exists; refusing to reuse it.' }
# Restrict only this NEW output folder, before copying any browsing data.
# Parent folders retain their existing ACLs. Children inherit SYSTEM/Admin access.
$null = [IO.Directory]::CreateDirectory($OutputRoot)
$acl = New-Object Security.AccessControl.DirectorySecurity
$acl.SetAccessRuleProtection($true, $false)
$inherit = [Security.AccessControl.InheritanceFlags]::ContainerInherit -bor [Security.AccessControl.InheritanceFlags]::ObjectInherit
foreach ($sid in @('S-1-5-18', 'S-1-5-32-544')) {
    $principal = New-Object Security.Principal.SecurityIdentifier -ArgumentList $sid
    $rule = New-Object Security.AccessControl.FileSystemAccessRule -ArgumentList @($principal, [Security.AccessControl.FileSystemRights]::FullControl, $inherit, [Security.AccessControl.PropagationFlags]::None, [Security.AccessControl.AccessControlType]::Allow)
    $acl.AddAccessRule($rule)
}
$null = [IO.Directory]::CreateDirectory($RunDir, $acl)
$createdAcl = Get-Acl -LiteralPath $RunDir
$createdRules = @($createdAcl.GetAccessRules($true, $true, [Security.Principal.SecurityIdentifier]))
if (-not $createdAcl.AreAccessRulesProtected -or $createdRules.Count -ne 2 -or
    @($createdRules | Where-Object { $_.IdentityReference.Value -notin @('S-1-5-18','S-1-5-32-544') -or $_.AccessControlType -ne [Security.AccessControl.AccessControlType]::Allow -or $_.FileSystemRights -ne [Security.AccessControl.FileSystemRights]::FullControl -or $_.InheritanceFlags -ne $inherit }).Count -gt 0) {
    throw "Could not verify restricted permissions on the new run folder: $RunDir. No browsing data was copied."
}
if (@(Get-ChildItem -LiteralPath $RunDir -Force).Count -ne 0) { throw 'New run folder is unexpectedly nonempty.' }
$TraceReportFolder = $RunDir
$WorkDir = Join-Path $RunDir 'working'
$null = [IO.Directory]::CreateDirectory($WorkDir)
$StartedUtc = [DateTime]::UtcNow.ToString('o')
$Statuses = New-Object 'System.Collections.Generic.List[object]'
$Matches = New-Object 'System.Collections.Generic.List[object]'
$Artifacts = New-Object 'System.Collections.Generic.List[object]'
$RunProblems = New-Object 'System.Collections.Generic.List[string]'
$FatalError = $null
$SqliteVersion = $null
$TempBefore = $env:TEMP
$TmpBefore = $env:TMP
$TraceCollectionStarted = $true
$TraceStage = 'collection'

# All P/Invoke strings are explicit UTF-8 bytes; pointers stay IntPtr (x64 safe).
# Use a fully qualified Windows DLL path, never a working-directory DLL search.
$CSharp = @'
using System;
using System.Text;
using System.Runtime.InteropServices;
using System.Collections.Generic;
namespace DownloadTrace {
 public sealed class Sqlite : IDisposable {
  private IntPtr db;
  private const string Dll = @"__SQLITE_DLL__";
  [DllImport(Dll, CallingConvention=CallingConvention.StdCall)] private static extern int sqlite3_open_v2(byte[] f, out IntPtr d, int flags, IntPtr vfs);
  [DllImport(Dll, CallingConvention=CallingConvention.StdCall)] private static extern int sqlite3_close_v2(IntPtr d);
  [DllImport(Dll, CallingConvention=CallingConvention.StdCall)] private static extern int sqlite3_prepare_v2(IntPtr d, byte[] sql, int n, out IntPtr s, IntPtr tail);
  [DllImport(Dll, CallingConvention=CallingConvention.StdCall)] private static extern int sqlite3_step(IntPtr s);
  [DllImport(Dll, CallingConvention=CallingConvention.StdCall)] private static extern int sqlite3_finalize(IntPtr s);
  [DllImport(Dll, CallingConvention=CallingConvention.StdCall)] private static extern int sqlite3_bind_text(IntPtr s, int i, byte[] text, int n, IntPtr destroy);
  [DllImport(Dll, CallingConvention=CallingConvention.StdCall)] private static extern int sqlite3_column_count(IntPtr s);
  [DllImport(Dll, CallingConvention=CallingConvention.StdCall)] private static extern IntPtr sqlite3_column_name(IntPtr s, int i);
  [DllImport(Dll, CallingConvention=CallingConvention.StdCall)] private static extern IntPtr sqlite3_column_text(IntPtr s, int i);
  [DllImport(Dll, CallingConvention=CallingConvention.StdCall)] private static extern int sqlite3_column_bytes(IntPtr s, int i);
  [DllImport(Dll, CallingConvention=CallingConvention.StdCall)] private static extern int sqlite3_column_type(IntPtr s, int i);
  [DllImport(Dll, CallingConvention=CallingConvention.StdCall)] private static extern IntPtr sqlite3_errmsg(IntPtr d);
  [DllImport(Dll, CallingConvention=CallingConvention.StdCall)] private static extern int sqlite3_busy_timeout(IntPtr d, int ms);
  [DllImport(Dll, CallingConvention=CallingConvention.StdCall)] private static extern int sqlite3_db_readonly(IntPtr d, byte[] name);
  [DllImport(Dll, CallingConvention=CallingConvention.StdCall)] private static extern int sqlite3_stmt_readonly(IntPtr s);
  [DllImport(Dll, CallingConvention=CallingConvention.StdCall)] private static extern IntPtr sqlite3_libversion();
  private static byte[] Z(string s) { return Encoding.UTF8.GetBytes(s + "\0"); }
  private static string Read(IntPtr p, int n) {
   if (p == IntPtr.Zero) return null;
   if (n < 0) { n=0; while (Marshal.ReadByte(p,n)!=0) { if (++n > 1048576) throw new Exception("Unbounded SQLite text."); } }
   if (n > 16777216) throw new Exception("SQLite field exceeds safety limit.");
   byte[] b=new byte[n]; Marshal.Copy(p,b,0,n); return Encoding.UTF8.GetString(b);
  }
  private void Check(int rc) { if (rc!=0) throw new Exception("SQLite " + rc + ": " + Read(sqlite3_errmsg(db),-1)); }
  public static string Version() { return Read(sqlite3_libversion(),-1); }
  public Sqlite(string file) {
   // SQLITE_OPEN_READONLY | SQLITE_OPEN_PRIVATECACHE, no CREATE, URI or immutable.
   int rc=sqlite3_open_v2(Z(file),out db,0x00000001 | 0x00040000,IntPtr.Zero);
   if (rc!=0) { string msg=(db==IntPtr.Zero)?"No SQLite handle":Read(sqlite3_errmsg(db),-1); Dispose(); throw new Exception("SQLite open " + rc + ": " + msg); }
   try {
    if (sqlite3_db_readonly(db,Z("main"))!=1) throw new Exception("Database was not opened read-only.");
    Check(sqlite3_busy_timeout(db,1500));
    // Connection-local memory temp storage prevents query sort files outside the run directory.
    Query("PRAGMA temp_store=MEMORY", new string[0]);
   } catch { Dispose(); throw; }
  }
  public List<Dictionary<string,string>> Query(string sql, string[] args) {
   IntPtr s=IntPtr.Zero;
   try {
    byte[] q=Z(sql); Check(sqlite3_prepare_v2(db,q,q.Length-1,out s,IntPtr.Zero));
    if (s==IntPtr.Zero) throw new Exception("Empty SQL statement.");
    if (sqlite3_stmt_readonly(s)==0) throw new Exception("Refused a non-read-only SQL statement.");
    for(int i=0;i<args.Length;i++) { byte[] b=Z(args[i]); Check(sqlite3_bind_text(s,i+1,b,b.Length-1,new IntPtr(-1))); }
    var result=new List<Dictionary<string,string>>();
    int rc;
    while((rc=sqlite3_step(s))==100) {
     var row=new Dictionary<string,string>(StringComparer.OrdinalIgnoreCase);
     for(int i=0;i<sqlite3_column_count(s);i++) {
      string name=Read(sqlite3_column_name(s,i),-1);
      if(sqlite3_column_type(s,i)==5) row[name]=null;
      else { IntPtr p=sqlite3_column_text(s,i); int n=sqlite3_column_bytes(s,i); row[name]=Read(p,n); }
     }
     result.Add(row);
     if(result.Count>50000) throw new Exception("Query row safety limit exceeded.");
    }
    if(rc!=101) Check(rc);
    return result;
   } finally { if(s!=IntPtr.Zero) sqlite3_finalize(s); }
  }
  public void Dispose() { if(db!=IntPtr.Zero) { sqlite3_close_v2(db); db=IntPtr.Zero; } }
 }
}
'@

function Get-FileStamp([string]$Path) {
    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) { return 'ABSENT' }
    $f = Get-Item -LiteralPath $Path -Force
    return '{0}|{1}|{2}' -f $f.Length, $f.LastWriteTimeUtc.Ticks, $f.CreationTimeUtc.Ticks
}
function Get-DownloadTraceJournalState([string]$Path) {
    # Header observations are NOT an atomic snapshot or proof of consistency.
    $stampBefore = Get-FileStamp $Path
    if ($stampBefore -eq 'ABSENT') {
        return [pscustomobject]@{ State='Absent'; Length=[Int64]0; HeaderHex=''; Stamp='ABSENT' }
    }
    Assert-NoReparse $Path
    $stream = $null
    $header = New-Object byte[] 28
    $count = 0
    try {
        $share = [IO.FileShare]::ReadWrite -bor [IO.FileShare]::Delete
        $stream = [IO.File]::Open($Path, [IO.FileMode]::Open, [IO.FileAccess]::Read, $share)
        $lengthBefore = $stream.Length
        if ($lengthBefore -gt 0) {
            if ($lengthBefore -lt 28) { throw 'Nonempty journal is shorter than 28 bytes; skipped.' }
            while ($count -lt 28) {
                $read = $stream.Read($header, $count, 28 - $count)
                if ($read -eq 0) { break }
                $count += $read
            }
            if ($count -ne 28) { throw 'Could not read the complete 28-byte journal header; skipped.' }
        }
        if ($stream.Length -ne $lengthBefore) { throw 'Journal length changed while reading its header; skipped.' }
    } finally {
        if ($null -ne $stream) { $stream.Dispose() }
    }
    $stampAfter = Get-FileStamp $Path
    if ($stampBefore -ne $stampAfter) { throw 'Journal metadata changed while reading its header; skipped.' }
    if ($lengthBefore -eq 0) {
        return [pscustomobject]@{ State='Empty'; Length=[Int64]0; HeaderHex=''; Stamp=$stampAfter }
    }
    # Deliberately narrow: accept only a zero magic AND zero record-count prefix.
    # Do not reinterpret other invalid/nonzero headers as harmless journals.
    for ($i = 0; $i -lt 12; $i++) {
        if ($header[$i] -ne 0) {
            throw 'Journal has a nonzero first-12-byte prefix; not classified as hot or safe. Collection skipped.'
        }
    }
    return [pscustomobject]@{
        State='ZeroPrefixProvisional'
        Length=$lengthBefore
        HeaderHex=[BitConverter]::ToString($header, 0, 28)
        Stamp=$stampAfter
    }
}
function Copy-SharedFile([string]$Source, [string]$Destination) {
    Assert-NoReparse $Source
    $inputStream = $null; $outputStream = $null
    try {
        $inputStream = [IO.File]::Open($Source, [IO.FileMode]::Open, [IO.FileAccess]::Read, ([IO.FileShare]::ReadWrite -bor [IO.FileShare]::Delete))
        $outputStream = [IO.File]::Open($Destination, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write, [IO.FileShare]::None)
        $buffer = New-Object byte[] (1MB)
        $copiedBytes = [Int64]0
        while (($read = $inputStream.Read($buffer, 0, $buffer.Length)) -gt 0) {
            $copiedBytes += $read
            if ($copiedBytes -gt ([Int64]$MaxDatabaseSetMB * 1MB)) { throw 'File grew beyond the copy safety limit.' }
            $outputStream.Write($buffer, 0, $read)
        }
    } finally {
        if ($null -ne $outputStream) { $outputStream.Dispose() }
        if ($null -ne $inputStream) { $inputStream.Dispose() }
    }
}
function Convert-ChromiumTime([string]$Value) {
    if ([string]::IsNullOrEmpty($Value) -or $Value -eq '0') { return $null }
    try {
        $microseconds = [Int64]::Parse($Value, [Globalization.CultureInfo]::InvariantCulture)
        # Chromium microseconds since 1601 -> Windows FILETIME 100 ns ticks, exactly.
        $ticks = [decimal]$microseconds * [decimal]10
        if ($ticks -lt 0 -or $ticks -gt [Int64]::MaxValue) { return $null }
        return [DateTime]::FromFileTimeUtc([Int64]$ticks).ToString('o')
    } catch { return $null }
}
function Write-JsonFile([object]$Object, [string]$Path) {
    ConvertTo-Json -InputObject $Object -Depth 12 | Set-Content -LiteralPath $Path -Encoding UTF8
}
# No recursive deletion across reparse points, and only the unique owned work directory.
function Remove-OwnedWork {
    if (-not (Test-Path -LiteralPath $WorkDir)) { return }
    if ([IO.Path]::GetFullPath($WorkDir) -ne (Join-Path $RunDir 'working')) { throw 'Unexpected cleanup path.' }
    Assert-NoReparse $WorkDir
    $pending = New-Object 'System.Collections.Generic.Queue[string]'
    $pending.Enqueue($WorkDir)
    while ($pending.Count -gt 0) {
        $folder = $pending.Dequeue()
        foreach ($entry in @(Get-ChildItem -LiteralPath $folder -Force)) {
            if (($entry.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { throw 'Cleanup refused a reparse point.' }
            if ($entry.PSIsContainer) { $pending.Enqueue($entry.FullName) }
        }
    }
    Remove-Item -LiteralPath $WorkDir -Recurse -Force
}

try {
    # Windows PowerShell Add-Type may invoke the built-in C# compiler using TEMP.
    $env:TEMP = $WorkDir; $env:TMP = $WorkDir
    if (-not ('DownloadTrace.Sqlite' -as [type])) {
        Add-Type -TypeDefinition ($CSharp.Replace('__SQLITE_DLL__', $SqliteDll.Replace('"','""'))) -Language CSharp
    }
    $SqliteVersion = [DownloadTrace.Sqlite]::Version()
    $Browsers = @(
        [pscustomobject]@{ Name='Chrome'; Root=(Join-Path $ProfilePath 'AppData\Local\Google\Chrome\User Data') },
        [pscustomobject]@{ Name='Edge'; Root=(Join-Path $ProfilePath 'AppData\Local\Microsoft\Edge\User Data') }
    )
    foreach ($browser in $Browsers) {
        if (-not (Test-Path -LiteralPath $browser.Root -PathType Container)) {
            $Statuses.Add([pscustomobject]@{Browser=$browser.Name; BrowserProfile=$null; Source=$browser.Root; Status='NotPresent'; Matches=0; Detail='Standard user-data folder not found.'})
            continue
        }
        try { Assert-NoReparse $browser.Root; $profiles = @(Get-ChildItem -LiteralPath $browser.Root -Directory -Force) }
        catch {
            $Statuses.Add([pscustomobject]@{Browser=$browser.Name; BrowserProfile=$null; Source=$browser.Root; Status='Error'; Matches=0; Detail=$_.Exception.Message})
            continue
        }
        $foundHistory = $false
        foreach ($profile in $profiles) {
            $source = Join-Path $profile.FullName 'History'
            if (-not (Test-Path -LiteralPath $source -PathType Leaf)) { continue }
            $foundHistory = $true
            $db = $null; $count = 0
            $status = [ordered]@{Browser=$browser.Name; BrowserProfile=$profile.Name; Source=$source; Status='Error'; Matches=0; Detail=''; MissingColumns=@()}
            try {
                Assert-NoReparse $source
                $copyDir = Join-Path $WorkDir ([Guid]::NewGuid().ToString('N'))
                $null = [IO.Directory]::CreateDirectory($copyDir)
                $before = @{}; $total = [Int64]0
                foreach ($suffix in @('', '-wal', '-shm', '-journal')) {
                    $before[$suffix] = Get-FileStamp ($source + $suffix)
                    if ($before[$suffix] -ne 'ABSENT') { $total += (Get-Item -LiteralPath ($source + $suffix)).Length }
                }
                if ($total -gt ([Int64]$MaxDatabaseSetMB * 1MB)) { throw "Database set exceeds $MaxDatabaseSetMB MB safety limit." }
                $journalBefore = Get-DownloadTraceJournalState ($source + '-journal')
                if ($journalBefore.Stamp -ne $before['-journal']) {
                    throw 'Journal changed between metadata and header sampling; skipped.'
                }
                foreach ($suffix in @('', '-wal', '-shm', '-journal')) {
                    if ($before[$suffix] -eq 'ABSENT') { continue }
                    $dest = Join-Path $copyDir ('History' + $suffix)
                    Copy-SharedFile ($source + $suffix) $dest
                    $Artifacts.Add([pscustomobject]@{Source=($source+$suffix); BeforeStamp=$before[$suffix]; CopyRelativePath=('working\'+[IO.Path]::GetFileName($copyDir)+'\History'+$suffix); CopyBytes=(Get-Item -LiteralPath $dest).Length; CopySHA256=(Get-FileHash -LiteralPath $dest -Algorithm SHA256).Hash})
                }
                foreach ($suffix in @('', '-wal', '-journal')) {
                    if ($before[$suffix] -ne (Get-FileStamp ($source + $suffix))) {
                        throw 'Source database/WAL/journal changed during copying. Results skipped; retry after the user closes the browser normally.'
                    }
                }
                $journalAfter = Get-DownloadTraceJournalState ($source + '-journal')
                if ($journalBefore.Stamp -ne $journalAfter.Stamp -or
                    $journalBefore.State -ne $journalAfter.State -or
                    $journalBefore.Length -ne $journalAfter.Length -or
                    $journalBefore.HeaderHex -cne $journalAfter.HeaderHex) {
                    throw 'Source journal metadata/header changed during copying; skipped.'
                }
                $journalCopy = Get-DownloadTraceJournalState (Join-Path $copyDir 'History-journal')
                if ($journalBefore.State -ne $journalCopy.State -or
                    $journalBefore.Length -ne $journalCopy.Length -or
                    $journalBefore.HeaderHex -cne $journalCopy.HeaderHex) {
                    throw 'Copied journal does not match the sampled source length/header; skipped.'
                }
                $status['JournalAssessment'] = $journalCopy.State
                if ($journalCopy.State -eq 'ZeroPrefixProvisional') {
                    $status['JournalAssessment'] = 'Provisional zero-prefix journal; sampled source/copy headers agree. Best-effort live copy, not an atomic forensic snapshot.'
                }
                # Keep the journal beside the copy. The unchanged code below opens
                # normal READONLY SQLite and requires quick_check; no recovery,
                # immutable mode, journal deletion, or source-side SQLite opening.
                $copy = Join-Path $copyDir 'History'
                $db = New-Object DownloadTrace.Sqlite -ArgumentList $copy
                $check = @($db.Query('PRAGMA quick_check(1)', [string[]]@()))
                if ($check.Count -ne 1 -or $check[0]['quick_check'] -ne 'ok') { throw 'SQLite quick_check failed; this copy will not be queried.' }
                $cols = @($db.Query('PRAGMA table_info(downloads)', [string[]]@()) | ForEach-Object { $_['name'] })
                if ($cols -notcontains 'id') { throw 'No supported downloads table found.' }
                $chainCols = @($db.Query('PRAGMA table_info(downloads_url_chains)', [string[]]@()) | ForEach-Object { $_['name'] })
                $hasChains = ($chainCols -contains 'id' -and $chainCols -contains 'chain_index' -and $chainCols -contains 'url')
                $wanted = @('id','guid','current_path','target_path','start_time','end_time','referrer','site_url','tab_url','tab_referrer_url','url','state','danger_type','interrupt_reason','received_bytes','total_bytes','mime_type')
                $select = @(); $predicates = @()
                foreach ($name in $wanted) {
                    if ($cols -contains $name) { $select += ('d."{0}" AS "{0}"' -f $name) }
                    else { $select += ('NULL AS "{0}"' -f $name); $status.MissingColumns += $name }
                }
                foreach ($name in @('current_path','target_path','url','referrer','site_url','tab_url','tab_referrer_url')) {
                    if ($cols -contains $name) { $predicates += ('instr(lower(coalesce(d."{0}",'''')),lower(?1))>0' -f $name) }
                }
                if ($hasChains) { $predicates += 'EXISTS (SELECT 1 FROM downloads_url_chains c WHERE c.id=d.id AND instr(lower(coalesce(c.url,'''')),lower(?1))>0)' }
                if ($predicates.Count -eq 0) { throw 'No searchable filename/URL columns found.' }
                $sql = 'SELECT ' + ($select -join ',') + ' FROM downloads d WHERE (' + ($predicates -join ' OR ') + ') ORDER BY d.id DESC LIMIT ' + ($MaxMatchesPerDatabase + 1)
                $rows = @($db.Query($sql, [string[]]@($FileName)))
                $truncated = $rows.Count -gt $MaxMatchesPerDatabase
                foreach ($row in @($rows | Select-Object -First $MaxMatchesPerDatabase)) {
                    $chain = @()
                    if ($hasChains) {
                        $chain = @($db.Query('SELECT chain_index,url FROM downloads_url_chains WHERE id=?1 ORDER BY chain_index ASC', [string[]]@($row['id'])) | ForEach-Object { [pscustomobject]@{Index=[int]($_['chain_index']); Url=$_['url']} })
                    }
                    $initial = $null; $final = $null; $urlEvidence = 'No recorded URL chain'
                    if ($chain.Count -gt 0) { $initial=$chain[0].Url; $final=$chain[-1].Url; $urlEvidence='Recorded URL chain: first and last entries' }
                    elseif ($row['url']) { $initial=$row['url']; $final=$row['url']; $urlEvidence='Legacy single URL; original/final distinction unavailable' }
                    $Matches.Add([pscustomobject][ordered]@{
                        Computer=$env:COMPUTERNAME; WindowsProfile=$ProfilePath; Browser=$browser.Name; BrowserProfile=$profile.Name;
                        SourceDatabase=$source; DownloadId=$row['id']; Guid=$row['guid']; TargetPath=$row['target_path']; CurrentPath=$row['current_path'];
                        StartUtc=(Convert-ChromiumTime $row['start_time']); EndUtc=(Convert-ChromiumTime $row['end_time']);
                        StartRawChromiumMicroseconds=$row['start_time']; EndRawChromiumMicroseconds=$row['end_time'];
                        InitialRecordedUrl=$initial; FinalRecordedUrl=$final; UrlEvidence=$urlEvidence; UrlChain=$chain;
                        Referrer=$row['referrer']; TabUrl=$row['tab_url']; TabReferrerUrl=$row['tab_referrer_url']; SiteUrl=$row['site_url'];
                        StateRaw=$row['state']; DangerTypeRaw=$row['danger_type']; InterruptReasonRaw=$row['interrupt_reason'];
                        ReceivedBytes=$row['received_bytes']; TotalBytes=$row['total_bytes']; MimeType=$row['mime_type'];
                        CopyCaveat='Best-effort live copy; stable sampled metadata and quick_check are not proof of an atomic snapshot.'
                    })
                    $count++
                }
                $status.Matches = $count
                if ($truncated) { $status.Status='Truncated'; $status.Detail="More than $MaxMatchesPerDatabase matches. Highest download IDs retained, not necessarily latest timestamps." }
                else { $status.Status='Queried'; $status.Detail='Matching records only. No detected metadata change; quick_check passed. Live-copy consistency is not guaranteed.' }
            } catch { $status.Detail=$_.Exception.Message; $status.Matches=$count }
            finally { if ($null -ne $db) { $db.Dispose() } }
            $Statuses.Add([pscustomobject]$status)
        }
        if (-not $foundHistory) {
            $Statuses.Add([pscustomobject]@{Browser=$browser.Name; BrowserProfile=$null; Source=$browser.Root; Status='NotPresent'; Matches=0; Detail='No History file found in immediate browser-profile folders.'})
        }
    }
} catch { $FatalError = $_.Exception.Message }
finally {
    $env:TEMP = $TempBefore; $env:TMP = $TmpBefore
    if (-not $KeepWorkingCopies) {
        try { Remove-OwnedWork } catch { $RunProblems.Add('Temporary-copy cleanup failed: ' + $_.Exception.Message) }
    }
}

$TraceStage = 'local report writing'
$Report = [ordered]@{
    ScriptVersion='1.1-standalone'; StartedUtc=$StartedUtc; FinishedUtc=[DateTime]::UtcNow.ToString('o'); Computer=$env:COMPUTERNAME;
    ProfilePath=$ProfilePath; SearchFileName=$FileName; SQLiteVersion=$SqliteVersion; MatchCount=$Matches.Count;
    WorkingCopiesRequested=[bool]$KeepWorkingCopies; WorkingDirectoryStillPresent=(Test-Path -LiteralPath $WorkDir);
    FatalError=$FatalError; Problems=$RunProblems.ToArray(); Databases=$Statuses.ToArray(); Matches=$Matches.ToArray();
    Caveat='Browser download evidence only. Does not establish execution, installation, compromise, or a complete redirect/network history. Zero matches does not exclude a download.'
}
Write-JsonFile $Report (Join-Path $RunDir 'report.json')
Write-JsonFile ($Artifacts.ToArray()) (Join-Path $RunDir 'copy-manifest.json')
$summary = @(
    'Browser download trace',
    "Computer: $env:COMPUTERNAME", "Windows profile: $ProfilePath", "Search: $FileName",
    "Matching download records: $($Matches.Count)", "SQLite: $SqliteVersion", "Report: $RunDir\report.json",
    '', 'Read report.json for matching URLs, recorded URL-chain entries, referrers, UTC timestamps, and per-database status.',
    'Source browser files were not intentionally modified. Reports and temporary copies were written on this machine.',
    'Live copies are not atomic forensic snapshots. Zero matches does not exclude a download.',
    'URLs may contain sensitive query values. Do not automatically open links or upload the complete report publicly.',
    'Temporary History copies contain broader browsing data, though reports contain only matching download records.'
)
foreach ($s in $Statuses) { $summary += ('{0}/{1}: {2}; matches={3}; {4}' -f $s.Browser,$s.BrowserProfile,$s.Status,$s.Matches,$s.Detail) }
if ($FatalError) { $summary += 'FATAL: ' + $FatalError }
foreach ($problem in $RunProblems) { $summary += $problem }
if (Test-Path -LiteralPath $WorkDir) { $summary += 'SENSITIVE WORKING COPIES REMAIN: ' + $WorkDir }
$summary | Set-Content -LiteralPath (Join-Path $RunDir 'summary.txt') -Encoding UTF8

$TraceReportsWritten = $true
$incomplete = ($null -ne $FatalError) -or ($RunProblems.Count -gt 0) -or (@($Statuses | Where-Object { $_.Status -eq 'Error' -or $_.Status -eq 'Truncated' }).Count -gt 0) -or (@($Statuses | Where-Object { $_.Status -eq 'Queried' }).Count -eq 0)
if (-not $incomplete) { $TraceExitCode = 0 }

} catch {
    $TraceExitCode = 2
    $TraceFailureType = $_.Exception.GetType().Name
    # Do not send raw exception messages: they can contain paths or URL evidence.
} finally {
    try {
        function Convert-TraceLogText([object]$Value, [int]$Limit = 120) {
            $text = [string]$Value
            $text = [regex]::Replace($text, '[\p{Cc}\p{Cf}]', ' ')
            $text = [regex]::Replace($text, '(?i)\b(?:https?|ftp)://\S+', '[URL omitted]')
            if ([string]::IsNullOrWhiteSpace($text)) { return '(unavailable)' }
            if ($text.Length -gt $Limit) { return $text.Substring(0, $Limit) + '...[truncated]' }
            return $text
        }
        function Get-TraceSourceHost([object]$Value) {
            $uri = $null
            if ([string]::IsNullOrWhiteSpace([string]$Value)) { return '(not recorded)' }
            if ([Uri]::TryCreate([string]$Value, [UriKind]::Absolute, [ref]$uri) -and
                $uri.Scheme -in @('http','https','ftp') -and $uri.Host) {
                return (Convert-TraceLogText $uri.DnsSafeHost 253)
            }
            return '(unavailable or unsupported URL)'
        }
        $traceLines = New-Object 'System.Collections.Generic.List[string]'
        $traceLines.Add('=== Browser download trace results (hostname-only summary) ===')
        $traceCount = -1
        $traceStatus = 'Incomplete - collection did not finish'
        $traceQueried = 0; $traceErrors = 0; $traceTruncated = 0; $traceAbsent = 0
        if ($TraceCollectionStarted) {
            $traceCount = $Matches.Count
            $traceQueried = @($Statuses | Where-Object { $_.Status -eq 'Queried' }).Count
            $traceErrors = @($Statuses | Where-Object { $_.Status -eq 'Error' }).Count
            $traceTruncated = @($Statuses | Where-Object { $_.Status -eq 'Truncated' }).Count
            $traceAbsent = @($Statuses | Where-Object { $_.Status -eq 'NotPresent' }).Count
            if ($TraceExitCode -eq 0 -and $TraceReportsWritten) { $traceStatus = 'Completed - available databases only; best-effort live copies' }
        }
        $traceLines.Add('CollectionStatus: ' + $traceStatus)
        $traceLines.Add('MatchCount: ' + $traceCount + ' (-1 means collection did not start; partial counts are not totals)')
        $traceLines.Add('Windows profile: ' + (Convert-TraceLogText $ProfilePath 180))
        $traceLines.Add('Search filename: ' + (Convert-TraceLogText $FileName 255))
        $traceLines.Add(('Coverage: queried={0}; errors={1}; truncated={2}; not-present={3}' -f $traceQueried,$traceErrors,$traceTruncated,$traceAbsent))
        if ($TraceFailureType) { $traceLines.Add('Failure during ' + $TraceStage + ': ' + (Convert-TraceLogText $TraceFailureType 80) + '. Raw error details withheld from this log.') }
        if (-not $TraceCollectionStarted) { $traceLines.Add('Check the supplied local profile path, Windows PowerShell 5.1/x64 and permissions. No successful collection is reported.') }
        if ($TraceCollectionStarted) {
            $traceLines.Add(('Fatal collector error={0}; cleanup/other problems={1}. Details remain in local report when written.' -f [bool]$FatalError,$RunProblems.Count))
            foreach ($traceDb in @($Statuses | Select-Object -First 10)) {
                $traceLines.Add(('Database: {0}/{1}; status={2}; matches={3}' -f (Convert-TraceLogText $traceDb.Browser 20),(Convert-TraceLogText $traceDb.BrowserProfile 80),(Convert-TraceLogText $traceDb.Status 30),$traceDb.Matches))
            }
            if ($Statuses.Count -gt 10) { $traceLines.Add('Database status display truncated; remaining entries are in the local report.') }
            $traceShown = 0
            foreach ($traceRecord in @($Matches | Select-Object -First 10)) {
                $traceShown++
                $traceLeaf = '(not recorded; match may be in URL/referrer)'
                $tracePath = $traceRecord.TargetPath
                if (-not $tracePath) { $tracePath = $traceRecord.CurrentPath }
                if ($tracePath) {
                    try { $traceLeaf = [IO.Path]::GetFileName([string]$tracePath) } catch { $traceLeaf = '(unavailable)' }
                }
                $traceLines.Add(('Match {0}: browser={1}; profile={2}; download UTC={3}; filename={4}; initial-host={5}; final-host={6}' -f
                    $traceShown,(Convert-TraceLogText $traceRecord.Browser 20),(Convert-TraceLogText $traceRecord.BrowserProfile 80),
                    (Convert-TraceLogText $traceRecord.StartUtc 40),(Convert-TraceLogText $traceLeaf 120),
                    (Get-TraceSourceHost $traceRecord.InitialRecordedUrl),(Get-TraceSourceHost $traceRecord.FinalRecordedUrl)))
            }
            if ($traceCount -gt $traceShown) { $traceLines.Add(('Match display truncated: showing {0} of {1} retained matches; see local report for the rest.' -f $traceShown,$traceCount)) }
        }
        $traceLines.Add('Zero matches is NOT a clean verdict and does not exclude a download. Missing databases and collection errors limit coverage.')
        $traceLines.Add('Initial/final hosts mean first/last recorded URL-chain entries; a legacy single URL cannot establish that distinction.')
        $traceLines.Add('This evidence does not establish execution, installation or compromise. Full URLs/query values are omitted from console output. Paths, names, timestamps and hosts may still be sensitive.')
        $traceLines.Add('Report folder: ' + $TraceReportFolder)
        $traceLines.Add('Local reports written: ' + $TraceReportsWritten + '; if False, report files may be missing or partial.')
        $traceLines.Add('=== End browser download trace results ===')
        $ResultSummary = $traceLines.ToArray() -join " | "
        $traceLines.ToArray() | Write-Output
    } catch {
        $TraceExitCode = 2
        $ResultSummary = 'CollectionStatus: Incomplete - result formatting failed. No clean verdict. Inspect restricted local reports if present. Report folder: ' + $TraceReportFolder
        Write-Output $ResultSummary
        Write-Output ('Report folder: ' + $TraceReportFolder)
    }
}
# Console output and restricted local reports replace RMM-specific output bindings.
exit $TraceExitCode
