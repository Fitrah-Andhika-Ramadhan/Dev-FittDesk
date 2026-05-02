<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $query = Article::with('author')->orderBy('created_at', 'desc');

        if ($request->has('search') && $request->search) {
            $query->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('content', 'like', '%' . $request->search . '%');
        }

        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        $articles = $query->paginate(10)->withQueryString();

        return Inertia::render('Helpdesk/KnowledgeBase/Index', [
            'articles' => $articles,
            'filters' => $request->only(['search', 'category'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Helpdesk/KnowledgeBase/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|string|max:100',
            'status' => 'required|in:DRAFT,PUBLISHED'
        ]);

        $validated['author_id'] = auth()->id();

        Article::create($validated);

        return redirect()->route('articles.index')->with('success', 'Artikel berhasil dibuat.');
    }

    public function show($slug)
    {
        $article = Article::with('author')->where('slug', $slug)->firstOrFail();
        
        return Inertia::render('Helpdesk/KnowledgeBase/Show', [
            'article' => $article
        ]);
    }

    public function edit(Article $article)
    {
        return Inertia::render('Helpdesk/KnowledgeBase/Edit', [
            'article' => $article
        ]);
    }

    public function update(Request $request, Article $article)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|string|max:100',
            'status' => 'required|in:DRAFT,PUBLISHED'
        ]);

        $article->update($validated);

        return redirect()->route('articles.index')->with('success', 'Artikel berhasil diperbarui.');
    }

    public function destroy(Article $article)
    {
        $article->delete();

        return redirect()->route('articles.index')->with('success', 'Artikel berhasil dihapus.');
    }
}
