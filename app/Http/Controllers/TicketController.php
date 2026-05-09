<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $query = Ticket::with(['user', 'assignee'])->orderBy('created_at', 'desc');

        // Normal users only see their own tickets, Admins see all
        if (auth()->user()->role !== 'SUPER_ADMIN' && auth()->user()->role !== 'ADMIN') {
            $query->where('user_id', auth()->id());
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        if ($request->has('priority') && $request->priority) {
            $query->where('priority', $request->priority);
        }

        $tickets = $query->paginate(10)->withQueryString();

        return Inertia::render('Helpdesk/Tickets/Index', [
            'tickets' => $tickets,
            'filters' => $request->only(['status', 'priority']),
            'isAdmin' => auth()->user()->role === 'SUPER_ADMIN' || auth()->user()->role === 'ADMIN'
        ]);
    }

    public function create()
    {
        return Inertia::render('Helpdesk/Tickets/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:LOW,MEDIUM,HIGH,CRITICAL'
        ]);

        $validated['user_id'] = auth()->id();
        $validated['status'] = 'OPEN';

        $ticket = Ticket::create($validated);

        // Notify Admins
        $admins = User::whereIn('role', ['SUPER_ADMIN', 'ADMIN'])->get();
        foreach ($admins as $admin) {
            \App\Models\Notification::create([
                'user_id' => $admin->id,
                'title' => 'Tiket Baru: ' . $ticket->subject,
                'message' => auth()->user()->name . ' telah membuat tiket baru dengan prioritas ' . $ticket->priority,
                'type' => 'ticket_created'
            ]);
        }

        return redirect()->route('tickets.index')->with('success', 'Tiket berhasil dibuat.');
    }

    public function show(Ticket $ticket)
    {
        // Check authorization
        if (auth()->user()->role !== 'SUPER_ADMIN' && auth()->user()->role !== 'ADMIN' && $ticket->user_id !== auth()->id()) {
            abort(403);
        }

        $ticket->load(['user', 'assignee']);
        $agents = User::whereIn('role', ['SUPER_ADMIN', 'ADMIN'])->select('id', 'name')->get();

        return Inertia::render('Helpdesk/Tickets/Show', [
            'ticket' => $ticket,
            'agents' => $agents,
            'isAdmin' => auth()->user()->role === 'SUPER_ADMIN' || auth()->user()->role === 'ADMIN'
        ]);
    }

    public function update(Request $request, Ticket $ticket)
    {
        // Only admins can update status/assignee directly here
        if (auth()->user()->role !== 'SUPER_ADMIN' && auth()->user()->role !== 'ADMIN') {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|in:OPEN,IN_PROGRESS,RESOLVED,CLOSED',
            'assigned_to' => 'nullable|exists:users,id'
        ]);

        $oldStatus = $ticket->status;
        $ticket->update($validated);

        if ($oldStatus !== $ticket->status) {
            \App\Models\Notification::create([
                'user_id' => $ticket->user_id,
                'title' => 'Status Tiket Diperbarui',
                'message' => 'Tiket "' . $ticket->subject . '" Anda sekarang berstatus ' . $ticket->status,
                'type' => 'ticket_updated'
            ]);
        }

        return back()->with('success', 'Tiket berhasil diperbarui.');
    }

    public function destroy(Ticket $ticket)
    {
        if (auth()->user()->role !== 'SUPER_ADMIN' && auth()->user()->role !== 'ADMIN') {
            abort(403);
        }

        $ticket->delete();

        return redirect()->route('tickets.index')->with('success', 'Tiket berhasil dihapus.');
    }
}
