<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Report::query();

        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('report_type', $request->type);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $reports = $query->orderBy('created_at', 'desc')->get()->map(function ($report) {
            $data = is_string($report->data) ? json_decode($report->data, true) : $report->data;
            return [
                'id' => $report->id,
                'userId' => $report->user_id,
                'title' => $report->title,
                'description' => $report->description,
                'reportType' => $report->report_type,
                'data' => $data,
                'createdAt' => $report->created_at->toISOString(),
            ];
        });

        $allReports = Report::all();
        $completed = 0;
        $inProgress = 0;
        foreach($allReports as $r) {
            $data = is_string($r->data) ? json_decode($r->data, true) : $r->data;
            $status = $data['status'] ?? '';
            if ($status === 'Completed') $completed++;
            elseif ($status === 'In Progress') $inProgress++;
        }

        $stats = [
            'total' => $allReports->count(),
            'completed' => $completed,
            'inProgress' => $inProgress,
            'byType' => $allReports->groupBy('report_type')->map->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'reports' => $reports,
                'stats' => $stats,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'reportType' => 'required',
        ]);

        $report = Report::create([
            'user_id' => Auth::id() ?? \App\Models\User::first()->id ?? '1',
            'title' => $request->title,
            'description' => $request->description,
            'report_type' => $request->reportType,
            'data' => config('database.default') === 'sqlite' ? json_encode($request->data ?? []) : ($request->data ?? []),
        ]);

        return response()->json([
            'success' => true,
            'data' => $report
        ], 201);
    }

    public function destroy($id)
    {
        $report = Report::find($id);
        if (!$report) {
            return response()->json(['success' => false, 'error' => 'Report not found'], 404);
        }
        $report->delete();

        return response()->json(['success' => true]);
    }
}
