<?php

namespace App\Http\Controllers;

use App\Models\LandingMedia;
use Illuminate\Http\Request;

class LandingMediaController extends Controller
{
    public function index()
    {
        $media = LandingMedia::orderBy('position')->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'type' => $item->type,
                'title' => $item->title,
                'description' => $item->description,
                'url' => $item->url,
                'thumbnail' => $item->thumbnail,
                'position' => $item->position,
                'featured' => (bool)$item->featured,
                'uploadedAt' => $item->created_at->toISOString(),
            ];
        });



        return response()->json([
            'success' => true,
            'data' => $media
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|string',
            'title' => 'required|string',
        ]);

        $url = $request->url;
        $thumbnail = $request->thumbnail;

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('media', 'public');
            $url = '/storage/' . $path;
            $thumbnail = $url;
        }

        $media = LandingMedia::create([
            'type' => $request->type,
            'title' => $request->title,
            'description' => $request->description ?? '',
            'url' => $url ?? '',
            'thumbnail' => $thumbnail,
            'position' => LandingMedia::max('position') + 1,
            'featured' => filter_var($request->featured, FILTER_VALIDATE_BOOLEAN),
        ]);

        return response()->json(['success' => true, 'data' => $media], 201);
    }

    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required',
            'type' => 'required|string',
            'title' => 'required|string',
        ]);

        $media = LandingMedia::find($request->id);
        if (!$media) {
            return response()->json(['success' => false, 'error' => 'Not found'], 404);
        }

        $url = $request->url ?? $media->url;
        $thumbnail = $request->thumbnail ?? $media->thumbnail;

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('media', 'public');
            $url = '/storage/' . $path;
            $thumbnail = $url;
        }

        $media->update([
            'type' => $request->type,
            'title' => $request->title,
            'description' => $request->description ?? '',
            'url' => $url,
            'thumbnail' => $thumbnail,
            'featured' => filter_var($request->featured, FILTER_VALIDATE_BOOLEAN),
        ]);

        return response()->json(['success' => true, 'data' => $media]);
    }

    public function destroy(Request $request)
    {
        $media = LandingMedia::find($request->id);
        if ($media) {
            $media->delete();
        }
        return response()->json(['success' => true]);
    }
}
