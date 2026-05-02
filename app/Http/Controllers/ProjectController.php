<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Get list of projects with phases for API.
     */
    public function apiIndex()
    {
        $projects = Project::with('phases')->get();
        
        $data = $projects->map(function ($project) {
            return [
                'id' => $project->id,
                'name' => $project->name,
                'location' => $project->location,
                'status' => $project->status === 'IN_PROGRESS' ? 'In Progress' : $project->status,
                'budgetAmount' => (float) $project->budget_amount,
                'spentAmount' => (float) $project->spent_amount,
                'startDate' => $project->start_date,
                'endDate' => $project->end_date,
                'phases' => $project->phases->map(function ($phase) {
                    return [
                        'id' => $phase->id,
                        'name' => $phase->name,
                        'progress' => (float) $phase->progress,
                    ];
                })->toArray(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    /**
     * Get analytics for a project.
     */
    public function analytics($id)
    {
        $days = request()->query('days', 30);
        $project = Project::findOrFail($id);
        
        $analytics = $project->analytics()
            ->orderBy('date', 'asc')
            ->take($days)
            ->get();

        $data = $analytics->map(function ($item) {
            return [
                'date' => $item->date->format('Y-m-d'),
                'workersOnSite' => $item->workers_on_site,
                'safetyIncidents' => $item->safety_incidents,
                'qualityScore' => (float) $item->quality_score,
                'progressPercentage' => (float) $item->overall_progress,
                'budgetUtilization' => $item->daily_cost > 0 ? rand(60, 90) : 0, // Mocking budgetUtilization for frontend
                'dailyCost' => (float) $item->daily_cost,
                'dailyRevenue' => (float) $item->daily_revenue,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'analytics' => $data,
            ]
        ]);
    }
}
