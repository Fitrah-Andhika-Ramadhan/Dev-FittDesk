<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Harian Kerja</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.4; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .title { font-size: 20px; font-weight: bold; text-transform: uppercase; }
        .subtitle { font-size: 16px; color: #666; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: top; }
        th { background-color: #f4f4f4; width: 30%; }
        .section-title { font-size: 16px; font-weight: bold; margin-top: 20px; margin-bottom: 10px; background-color: #eee; padding: 5px; }
        .footer { margin-top: 40px; text-align: right; }
        @media print {
            .no-print { display: none; }
        }
        .btn-print { background: #000; color: #fff; padding: 10px 20px; text-decoration: none; display: inline-block; margin-bottom: 20px; border-radius: 4px; }
    </style>
</head>
<body {!! isset($print) && $print ? 'onload="window.print()"' : '' !!}>
    
    @if(isset($print) && $print)
    <div class="no-print">
        <button onclick="window.print()" class="btn-print">Print / Save as PDF</button>
        <a href="javascript:history.back()" class="btn-print" style="background:#666">Kembali</a>
    </div>
    @endif

    <div class="header">
        <div class="title">DOKUMENTASI LAPORAN HARIAN KERJA</div>
        <div class="subtitle">FittDesk Construction</div>
    </div>

    <table>
        <tr>
            <th>Proyek</th>
            <td>{{ $report->project_name }}</td>
        </tr>
        <tr>
            <th>Tanggal Laporan</th>
            <td>{{ $report->report_date->format('d/m/Y') }}</td>
        </tr>
        <tr>
            <th>Cuaca</th>
            <td>{{ $report->weather ?: '-' }}</td>
        </tr>
        <tr>
            <th>Jumlah Pekerja</th>
            <td>{{ $report->workers_count }} Orang</td>
        </tr>
        <tr>
            <th>Status Laporan</th>
            <td>{{ $report->status }}</td>
        </tr>
        <tr>
            <th>Dibuat Oleh</th>
            <td>{{ $report->user->name ?? 'Unknown' }}</td>
        </tr>
    </table>

    <div class="section-title">Detail Pekerjaan</div>
    <table>
        <tr>
            <th>Kegiatan Utama / Pekerjaan</th>
            <td>{!! nl2br(e($report->activities)) !!}</td>
        </tr>
        <tr>
            <th>Peralatan Kerja / Alat Berat</th>
            <td>{!! nl2br(e($report->equipment ?: '-')) !!}</td>
        </tr>
        <tr>
            <th>Material Diterima</th>
            <td>{!! nl2br(e($report->material_received ?: '-')) !!}</td>
        </tr>
        <tr>
            <th>Kendala / Isu Lapangan</th>
            <td>{!! nl2br(e($report->issues ?: '-')) !!}</td>
        </tr>
        <tr>
            <th>Catatan Tambahan</th>
            <td>{!! nl2br(e($report->notes ?: '-')) !!}</td>
        </tr>
    </table>

    @if($report->photo_path)
    <div class="section-title">Dokumentasi Foto</div>
    <div style="text-align: center; margin-top: 10px;">
        <img src="{{ asset('storage/' . $report->photo_path) }}" style="max-width: 100%; max-height: 400px; border: 1px solid #ddd; padding: 5px;" alt="Dokumentasi">
    </div>
    @endif

    <div class="footer">
        <p>Dilaporkan Pada: {{ $report->created_at->format('d/m/Y H:i') }}</p>
    </div>

</body>
</html>
