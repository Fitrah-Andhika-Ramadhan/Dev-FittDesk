<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $query = Document::query();

        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('doc_type', $request->type);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $documents = $query->orderBy('created_at', 'desc')->get()->map(function ($doc) {
            return [
                'id' => $doc->id,
                'projectId' => $doc->project_id,
                'projectName' => 'FittDesk IT Service Management',
                'title' => $doc->title,
                'description' => $doc->description,
                'fileType' => $doc->file_type,
                'fileUrl' => $doc->file_url,
                'fileSize' => $doc->file_size,
                'docType' => $doc->doc_type,
                'uploadedBy' => $doc->uploaded_by,
                'uploadedAt' => $doc->uploaded_at->toISOString(),
                'version' => $doc->version,
            ];
        });

        $allDocs = Document::all();
        $stats = [
            'total' => $allDocs->count(),
            'totalSize' => $allDocs->sum('file_size'),
            'byType' => $allDocs->groupBy('doc_type')->map->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'documents' => $documents,
                'stats' => $stats,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'docType' => 'required',
            'file' => 'nullable|file|max:10240', // max 10MB
        ]);

        $fileUrl = '';
        $fileSize = 0;
        $fileType = $request->fileType ?? 'unknown';

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('documents', 'public');
            $fileUrl = '/storage/' . $path;
            $fileSize = round($file->getSize() / 1024 / 1024, 2);
            $fileType = $file->getClientMimeType();
        } else if ($request->filled('manualFileUrl')) {
            $fileUrl = $request->manualFileUrl;
        } else {
            return response()->json(['success' => false, 'error' => 'File or URL is required'], 400);
        }

        $doc = Document::create([
            'project_id' => $request->projectId ?? '1',
            'title' => $request->title,
            'description' => $request->description,
            'file_type' => $fileType,
            'file_url' => $fileUrl,
            'file_size' => $fileSize,
            'doc_type' => $request->docType,
            'uploaded_by' => $request->uploadedBy ?? 'system',
            'uploaded_at' => now(),
            'version' => 1,
        ]);

        return response()->json([
            'success' => true,
            'data' => $doc
        ], 201);
    }

    public function destroy($id)
    {
        $doc = Document::find($id);
        if (!$doc) {
            return response()->json(['success' => false, 'error' => 'Document not found'], 404);
        }
        $doc->delete();

        return response()->json(['success' => true]);
    }
}
