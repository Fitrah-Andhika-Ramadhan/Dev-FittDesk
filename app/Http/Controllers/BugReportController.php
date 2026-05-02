<?php

namespace App\Http\Controllers;

use App\Models\BugReport;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BugReportController extends Controller
{
    public function index(Request $request)
    {
        $query = BugReport::with(['reporter', 'assignee'])->orderBy('created_at', 'desc');

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $bugReports = $query->paginate(10)->withQueryString();

        return Inertia::render('Helpdesk/Bugs/Index', [
            'bugs' => $bugReports,
            'filters' => $request->only(['status']),
            'isAdmin' => auth()->user()->role === 'SUPER_ADMIN' || auth()->user()->role === 'ADMIN'
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'severity' => 'required|in:LOW,MEDIUM,HIGH,CRITICAL'
        ]);

        $validated['reported_by'] = auth()->id();
        $validated['status'] = 'OPEN';

        BugReport::create($validated);

        return back()->with('success', 'Bug berhasil dilaporkan.');
    }

    public function update(Request $request, BugReport $bug)
    {
        if (auth()->user()->role !== 'SUPER_ADMIN' && auth()->user()->role !== 'ADMIN') {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|in:OPEN,INVESTIGATING,FIXED,CLOSED',
            'resolution_notes' => 'nullable|string'
        ]);

        if (empty($bug->assigned_to)) {
            $validated['assigned_to'] = auth()->id();
        }

        $bug->update($validated);

        return back()->with('success', 'Status bug berhasil diperbarui.');
    }
}
