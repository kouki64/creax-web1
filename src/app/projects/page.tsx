'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  category: string
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled'
  budget: {
    min: number
    max: number
  }
  deadline: string
  proposalsCount: number
  createdAt: string
  updatedAt: string
}

export default function ProjectListPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'deadline' | 'budget'>('newest')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // // 認証チェック（モック）
    // const user = localStorage.getItem('user')  // 'userType' → 'user' に変更
    // if (!user) {
    //   router.push('/login')
    //   return
    // }
    // const userData = JSON.parse(user)  // JSONパースを追加
    // if (userData.role !== 'client') {  // role プロパティをチェック
    //   router.push('/dashboard/creator')
    //   return
    // }

  // 案件データ取得（モック）
  fetchProjects()
}, [router])

  const fetchProjects = async () => {
    setLoading(true)
    // TODO: 実際のAPI呼び出しに置き換える
    setTimeout(() => {
      const mockProjects: Project[] = [
        {
          id: '1',
          title: 'アイドルグループ新曲のアレンジ制作',
          category: 'arrangement',
          status: 'open',
          budget: { min: 50000, max: 100000 },
          deadline: '2025-05-15',
          proposalsCount: 8,
          createdAt: '2025-04-01T10:00:00Z',
          updatedAt: '2025-04-01T10:00:00Z'
        },
        {
          id: '2',
          title: 'CM用BGM制作（30秒）',
          category: 'composition',
          status: 'in_progress',
          budget: { min: 80000, max: 150000 },
          deadline: '2025-04-30',
          proposalsCount: 12,
          createdAt: '2025-03-28T09:00:00Z',
          updatedAt: '2025-04-02T14:30:00Z'
        },
        {
          id: '3',
          title: 'ポップス楽曲のミキシング',
          category: 'mixing',
          status: 'completed',
          budget: { min: 30000, max: 50000 },
          deadline: '2025-04-10',
          proposalsCount: 5,
          createdAt: '2025-03-20T11:00:00Z',
          updatedAt: '2025-04-10T16:00:00Z'
        },
        {
          id: '4',
          title: '企業イメージソング作詞作曲',
          category: 'composition',
          status: 'draft',
          budget: { min: 100000, max: 200000 },
          deadline: '2025-06-01',
          proposalsCount: 0,
          createdAt: '2025-04-03T08:00:00Z',
          updatedAt: '2025-04-03T08:00:00Z'
        },
        {
          id: '5',
          title: 'アコースティックアレンジ',
          category: 'arrangement',
          status: 'open',
          budget: { min: 40000, max: 70000 },
          deadline: '2025-05-20',
          proposalsCount: 3,
          createdAt: '2025-04-02T13:00:00Z',
          updatedAt: '2025-04-02T13:00:00Z'
        }
      ]
      setProjects(mockProjects)
      setLoading(false)
    }, 1000)
  }

  // フィルタリングとソート
  const filteredAndSortedProjects = projects
    .filter(project => {
      const matchesFilter = filter === 'all' || project.status === filter
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesFilter && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        case 'budget':
          return b.budget.max - a.budget.max
        default:
          return 0
      }
    })

  const getStatusBadge = (status: Project['status']) => {
    const statusConfig = {
      draft: { label: '下書き', className: 'bg-gray-100 text-gray-800' },
      open: { label: '募集中', className: 'bg-green-100 text-green-800' },
      in_progress: { label: '進行中', className: 'bg-blue-100 text-blue-800' },
      completed: { label: '完了', className: 'bg-gray-100 text-gray-800' },
      cancelled: { label: 'キャンセル', className: 'bg-red-100 text-red-800' }
    }
    const config = statusConfig[status]
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    )
  }

  const getCategoryLabel = (category: string) => {
    const categories: { [key: string]: string } = {
      composition: '作曲',
      arrangement: 'アレンジ',
      lyrics: '作詞',
      mixing: 'ミキシング',
      mastering: 'マスタリング',
      recording: 'レコーディング'
    }
    return categories[category] || category
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6232] mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-[#ff6232]">
                Creax
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/projects" className="text-[#ff6232] font-medium">
                  案件管理
                </Link>
                <Link href="/messages" className="text-gray-700 hover:text-[#ff6232]">
                  メッセージ
                </Link>
                <Link href="/payments" className="text-gray-700 hover:text-[#ff6232]">
                  決済管理
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ページタイトルとアクション */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">案件管理</h1>
          <Link
            href="/projects/create"
            className="px-4 py-2 bg-[#ff6232] text-white rounded-lg hover:bg-[#ff8a5b] transition-colors flex items-center space-x-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>新規案件作成</span>
          </Link>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">全案件数</p>
            <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">募集中</p>
            <p className="text-2xl font-bold text-green-600">
              {projects.filter(p => p.status === 'open').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">進行中</p>
            <p className="text-2xl font-bold text-blue-600">
              {projects.filter(p => p.status === 'in_progress').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">完了</p>
            <p className="text-2xl font-bold text-gray-600">
              {projects.filter(p => p.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* フィルターとソート */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* 検索 */}
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="案件を検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232] focus:border-transparent"
              />
            </div>

            {/* フィルターとソート */}
            <div className="flex space-x-4">
              {/* ステータスフィルター */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232] focus:border-transparent"
              >
                <option value="all">すべて</option>
                <option value="draft">下書き</option>
                <option value="open">募集中</option>
                <option value="in_progress">進行中</option>
                <option value="completed">完了</option>
                <option value="cancelled">キャンセル</option>
              </select>

              {/* ソート */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232] focus:border-transparent"
              >
                <option value="newest">新しい順</option>
                <option value="deadline">納期順</option>
                <option value="budget">予算順</option>
              </select>
            </div>
          </div>
        </div>

        {/* 案件リスト */}
        <div className="space-y-4">
          {filteredAndSortedProjects.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <p className="text-gray-500">該当する案件がありません</p>
            </div>
          ) : (
            filteredAndSortedProjects.map((project) => (
              <div key={project.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-[#ff6232] transition-colors"
                      >
                        {project.title}
                      </Link>
                      {getStatusBadge(project.status)}
                    </div>
                    
                    <div className="flex flex-wrap items-center text-sm text-gray-500 space-x-4 mb-3">
                      <span className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {getCategoryLabel(project.category)}
                      </span>
                      <span className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        納期: {formatDate(project.deadline)}
                      </span>
                      <span className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        予算: ¥{project.budget.min.toLocaleString()} - ¥{project.budget.max.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        提案: {project.proposalsCount}件
                      </span>
                    </div>

                    <div className="flex items-center text-xs text-gray-400">
                      <span>作成: {formatDate(project.createdAt)}</span>
                      <span className="mx-2">•</span>
                      <span>更新: {formatDate(project.updatedAt)}</span>
                    </div>
                  </div>

                  {/* アクションボタン */}
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      href={`/projects/${project.id}`}
                      className="p-2 text-gray-600 hover:text-[#ff6232] transition-colors"
                      title="詳細を見る"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                    {project.status === 'draft' && (
                      <Link
                        href={`/projects/${project.id}/edit`}
                        className="p-2 text-gray-600 hover:text-[#ff6232] transition-colors"
                        title="編集"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                    )}
                    <button
                      className="p-2 text-gray-600 hover:text-[#ff6232] transition-colors"
                      title="その他"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ページネーション（今後実装） */}
        {filteredAndSortedProjects.length > 0 && (
          <div className="mt-6 flex justify-center">
            <nav className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50">
                前へ
              </button>
              <button className="px-3 py-1 border border-[#ff6232] bg-[#ff6232] text-white rounded-md text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                3
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50">
                次へ
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}