<?php

namespace App\Http\Controllers;

use App\Models\LandingMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LandingMediaController extends Controller
{
    /**
     * Convert any YouTube or Vimeo watch URL into an embeddable URL.
     */
    private function toEmbedUrl(string $url): string
    {
        // YouTube: https://www.youtube.com/watch?v=ID  OR  https://youtu.be/ID
        if (preg_match('/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/', $url, $m)) {
            return 'https://www.youtube.com/embed/' . $m[1];
        }

        // Vimeo: https://vimeo.com/ID
        if (preg_match('/vimeo\.com\/(\d+)/', $url, $m)) {
            return 'https://player.vimeo.com/video/' . $m[1];
        }

        // Already an embed URL or a direct file URL – return as-is
        return $url;
    }

    public function index()
    {
        $media = LandingMedia::orderBy('position')->get()->map(function ($item) {
            return [
                'id'         => $item->id,
                'type'       => $item->type,
                'title'      => $item->title,
                'description'=> $item->description,
                'url'        => $item->url,
                'thumbnail'  => $item->thumbnail,
                'position'   => $item->position,
                'featured'   => (bool) $item->featured,
                'uploadedAt' => $item->created_at->toISOString(),
            ];
        });

        return response()->json(['success' => true, 'data' => $media]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type'  => 'required|string|in:image,video',
            'title' => 'required|string|max:255',
        ]);

        $url       = $request->url ?? '';
        $thumbnail = $request->thumbnail ?? '';

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('media', 'public');
            // Use the full APP_URL so it's absolute and works everywhere
            $url  = Storage::disk('public')->url($path);
            if ($request->type === 'image') {
                $thumbnail = $url;
            }
        } else {
            // Auto-convert watch URL to embed URL for video
            if ($request->type === 'video') {
                $url = $this->toEmbedUrl($url);
            }
        }

        $media = LandingMedia::create([
            'type'        => $request->type,
            'title'       => $request->title,
            'description' => $request->description ?? '',
            'url'         => $url,
            'thumbnail'   => $thumbnail,
            'position'    => (LandingMedia::max('position') ?? 0) + 1,
            'featured'    => filter_var($request->featured, FILTER_VALIDATE_BOOLEAN),
        ]);

        return response()->json(['success' => true, 'data' => $media], 201);
    }

    public function update(Request $request)
    {
        $request->validate([
            'id'    => 'required',
            'type'  => 'required|string|in:image,video',
            'title' => 'required|string|max:255',
        ]);

        $media = LandingMedia::find($request->id);
        if (!$media) {
            return response()->json(['success' => false, 'error' => 'Not found'], 404);
        }

        $url       = $request->url ?? $media->url;
        $thumbnail = $request->thumbnail ?? $media->thumbnail;

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('media', 'public');
            $url  = Storage::disk('public')->url($path);
            if ($request->type === 'image') {
                $thumbnail = $url;
            }
        } else {
            if ($request->type === 'video') {
                $url = $this->toEmbedUrl($url);
            }
        }

        $media->update([
            'type'        => $request->type,
            'title'       => $request->title,
            'description' => $request->description ?? '',
            'url'         => $url,
            'thumbnail'   => $thumbnail,
            'featured'    => filter_var($request->featured, FILTER_VALIDATE_BOOLEAN),
        ]);

        return response()->json(['success' => true, 'data' => $media]);
    }

    public function destroy(Request $request)
    {
        $media = LandingMedia::find($request->id);
        if ($media) {
            // Try to delete stored file if it's a local storage URL
            if (str_contains($media->url, '/storage/')) {
                $relativePath = str_replace('/storage/', '', parse_url($media->url, PHP_URL_PATH));
                Storage::disk('public')->delete($relativePath);
            }
            $media->delete();
        }
        return response()->json(['success' => true]);
    }
}
