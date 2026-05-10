<?php

namespace App\Http\Controllers;

use App\Models\LandingMedia;
use Illuminate\Http\Request;

class LandingMediaController extends Controller
{
    /**
     * Convert share/watch URLs to embeddable/preview URLs.
     * Supports: YouTube, Vimeo, Google Drive
     */
    private function toEmbedUrl(string $url): string
    {
        $url = trim($url);

        // YouTube: watch?v=ID or youtu.be/ID
        if (preg_match('/(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/', $url, $m)) {
            return 'https://www.youtube.com/embed/' . $m[1];
        }

        // Vimeo: vimeo.com/ID
        if (preg_match('/(?<!player\.)vimeo\.com\/(\d+)/', $url, $m)) {
            return 'https://player.vimeo.com/video/' . $m[1];
        }

        // Google Drive share link: /file/d/FILE_ID/view  →  /file/d/FILE_ID/preview
        if (preg_match('/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/', $url, $m)) {
            return 'https://drive.google.com/file/d/' . $m[1] . '/preview';
        }

        // Google Drive open?id=FILE_ID
        if (preg_match('/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/', $url, $m)) {
            return 'https://drive.google.com/file/d/' . $m[1] . '/preview';
        }

        // Already a supported embed / preview URL – return as-is
        return $url;
    }

    /**
     * Generate a static thumbnail URL from a video link (best-effort).
     */
    private function autoThumbnail(string $url): string
    {
        if (preg_match('/(?:youtube\.com\/embed\/|youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/', $url, $m)) {
            return 'https://img.youtube.com/vi/' . $m[1] . '/maxresdefault.jpg';
        }
        return '';
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
            'url'   => 'required|string',
        ]);

        $url       = $this->toEmbedUrl($request->url);
        $thumbnail = $request->thumbnail ?? '';

        // Auto-generate thumbnail for YouTube if not provided
        if ($request->type === 'video' && empty($thumbnail)) {
            $thumbnail = $this->autoThumbnail($url);
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
            'url'   => 'required|string',
        ]);

        $media = LandingMedia::find($request->id);
        if (!$media) {
            return response()->json(['success' => false, 'error' => 'Not found'], 404);
        }

        $url       = $this->toEmbedUrl($request->url);
        $thumbnail = $request->thumbnail ?? $media->thumbnail ?? '';

        // Auto-generate thumbnail for YouTube if not provided
        if ($request->type === 'video' && empty($thumbnail)) {
            $thumbnail = $this->autoThumbnail($url);
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
            $media->delete();
        }
        return response()->json(['success' => true]);
    }
}
