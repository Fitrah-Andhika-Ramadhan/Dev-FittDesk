<?php

namespace App\Http\Controllers;

use App\Models\DailyReport;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;

class DailyReportController extends Controller
{
    public function index(Request $request)
    {
        $query = DailyReport::with(['user', 'project'])->orderBy('created_at', 'desc');

        // Apply filters
        if ($request->has('project_id') && $request->project_id) {
            $query->where('project_id', $request->project_id);
        }
        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('report_date', '>=', $request->date_from);
        }
        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('report_date', '<=', $request->date_to);
        }
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $reports = $query->paginate(10)->withQueryString();
        $projects = Project::select('id', 'name')->get();

        return Inertia::render('DailyReport/Index', [
            'reports' => $reports,
            'projects' => $projects,
            'filters' => $request->only(['project_id', 'date_from', 'date_to', 'status'])
        ]);
    }

    public function create()
    {
        $projects = Project::select('id', 'name')->get();
        return Inertia::render('DailyReport/Create', [
            'projects' => $projects
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'report_date' => 'required|date',
            'weather' => 'nullable|string|max:255',
            'workers_count' => 'required|integer|min:0',
            'equipment' => 'nullable|string',
            'material_received' => 'nullable|string',
            'activities' => 'required|string',
            'issues' => 'nullable|string',
            'photo' => 'nullable|image|max:5120',
            'notes' => 'nullable|string',
            'status' => 'required|in:DRAFT,SUBMITTED,APPROVED'
        ]);

        $project = Project::findOrFail($validated['project_id']);
        
        $data = $validated;
        unset($data['photo']);
        $data['user_id'] = auth()->id();
        $data['project_name'] = $project->name;

        if ($request->hasFile('photo')) {
            $data['photo_path'] = $request->file('photo')->store('daily_reports', 'public');
        }

        $report = DailyReport::create($data);

        if ($report->status === 'SUBMITTED' || $report->status === 'APPROVED') {
            $admins = \App\Models\User::whereIn('role', ['SUPER_ADMIN', 'ADMIN'])->get();
            foreach ($admins as $admin) {
                \App\Models\Notification::create([
                    'user_id' => $admin->id,
                    'title' => 'Laporan Harian Baru',
                    'message' => auth()->user()->name . ' telah mensubmit laporan harian untuk ' . $project->name,
                    'type' => 'report_submitted'
                ]);
            }
        }

        return redirect()->route('daily_reports.index')->with('success', 'Laporan Harian Kerja berhasil dibuat.');
    }

    public function show(DailyReport $dailyReport)
    {
        $dailyReport->load(['user', 'project']);
        return Inertia::render('DailyReport/Show', [
            'report' => $dailyReport
        ]);
    }

    public function edit(DailyReport $dailyReport)
    {
        $projects = Project::select('id', 'name')->get();
        return Inertia::render('DailyReport/Edit', [
            'report' => $dailyReport,
            'projects' => $projects
        ]);
    }

    public function update(Request $request, DailyReport $dailyReport)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'report_date' => 'required|date',
            'weather' => 'nullable|string|max:255',
            'workers_count' => 'required|integer|min:0',
            'equipment' => 'nullable|string',
            'material_received' => 'nullable|string',
            'activities' => 'required|string',
            'issues' => 'nullable|string',
            'photo' => 'nullable|image|max:5120',
            'notes' => 'nullable|string',
            'status' => 'required|in:DRAFT,SUBMITTED,APPROVED'
        ]);

        $project = Project::findOrFail($validated['project_id']);
        
        $data = $validated;
        unset($data['photo']);
        $data['project_name'] = $project->name;

        if ($request->hasFile('photo')) {
            if ($dailyReport->photo_path) {
                Storage::disk('public')->delete($dailyReport->photo_path);
            }
            $data['photo_path'] = $request->file('photo')->store('daily_reports', 'public');
        }

        $oldStatus = $dailyReport->status;
        $dailyReport->update($data);

        if ($oldStatus !== $dailyReport->status) {
            \App\Models\Notification::create([
                'user_id' => $dailyReport->user_id,
                'title' => 'Status Laporan Diperbarui',
                'message' => 'Laporan harian Anda tanggal ' . \Carbon\Carbon::parse($dailyReport->report_date)->format('d M Y') . ' sekarang berstatus ' . $dailyReport->status,
                'type' => 'report_updated'
            ]);
        }

        return redirect()->route('daily_reports.index')->with('success', 'Laporan Harian Kerja berhasil diperbarui.');
    }

    public function destroy(DailyReport $dailyReport)
    {
        if ($dailyReport->photo_path) {
            Storage::disk('public')->delete($dailyReport->photo_path);
        }
        $dailyReport->delete();

        return redirect()->route('daily_reports.index')->with('success', 'Laporan Harian Kerja berhasil dihapus.');
    }

    public function downloadPdf(DailyReport $dailyReport)
    {
        $dailyReport->load(['user', 'project']);
        
        // Ensure DomPDF is installed, if not we will use a basic print view
        if (class_exists(Pdf::class)) {
            $pdf = Pdf::loadView('pdf.daily_report', ['report' => $dailyReport]);
            return $pdf->download('Laporan-Harian-' . $dailyReport->report_date->format('Y-m-d') . '.pdf');
        }
        
        // Fallback to print view if dompdf is not installed
        return view('pdf.daily_report', ['report' => $dailyReport, 'print' => true]);
    }
}
