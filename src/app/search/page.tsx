'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  category: string
  status: 'open' | 'in_progress'  // クリエーターには募集中と進行中のみ表示
  client: {
    id: string
    name: string
    rating: number
    completedProjects: number
  }
  budget: {
    min: number
    max: number
  }
  deadline: string
  proposalsCount: number
  skills: string[]
  description: string
  createdAt: string
}

export default function SearchProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [budgetMin, setBudgetMin] = useState<string>('')
  const [budgetMax, setBudgetMax] = useState<string>('')
  const [sortBy, setSortBy] = useState<'newest' | 'deadline' | 'budget' | 'proposals'>('newest')
  const [showFilters, setShowFilters] = useState(true)

  useEffect(() => {
    // TODO: 認証チェック（現在はコメントアウト）
    // const user = localStorage.getItem('user')
    // if (!user) {
    //   router.push('/login')
    //   return
    // }
    // const userData = JSON.parse(user)
    // if (userData.role !== 'creator') {
    //   router.push('/dashboard/client')
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
          client: {
            id: '1',
            name: 'RINGAX Records',
            rating: 4.8,
            completedProjects: 23
          },
          budget: { min: 50000, max: 100000 },
          deadline: '2025-05-15',
          proposalsCount: 8,
          skills: ['Logic Pro', 'アレンジ', 'ポップス'],
          description: '新人アイドルグループの2ndシングルのアレンジを担当していただける方を探しています。明るくポップな雰囲気で...',
          createdAt: '2025-04-01T10:00:00Z'
        },
        {
          id: '2',
          title: 'CM用BGM制作（30秒）',
          category: 'composition',
          status: 'open',
          client: {
            id: '2',
            name: '株式会社ADクリエイト',
            rating: 4.5,
            completedProjects: 45
          },
          budget: { min: 80000, max: 150000 },
          deadline: '2025-04-30',
          proposalsCount: 12,
          skills: ['作曲', 'BGM', 'CM音楽'],
          description: '飲料メーカーの新商品CM用のBGMを制作していただける方を募集しています。爽やかで印象的な...',
          createdAt: '2025-03-28T09:00:00Z'
        },
        {
          id: '3',
          title: 'ゲーム用バトルBGM 5曲セット',
          category: 'composition',
          status: 'open',
          client: {
            id: '3',
            name: 'インディーゲームスタジオ',
            rating: 4.9,
            completedProjects: 12
          },
          budget: { min: 200000, max: 300000 },
          deadline: '2025-06-01',
          proposalsCount: 5,
          skills: ['ゲーム音楽', 'オーケストラ', 'バトルBGM'],
          description: 'RPGゲームのバトルシーン用BGMを5曲制作していただきたいです。壮大でエピックな...',
          createdAt: '2025-04-02T14:00:00Z'
        },
        {
          id: '4',
          title: '企業イメージソング作詞',
          category: 'lyrics',
          status: 'open',
          client: {
            id: '4',
            name: '株式会社ブランディング',
            rating: 4.6,
            completedProjects: 8
          },
          budget: { min: 30000, max: 50000 },
          deadline: '2025-05-10',
          proposalsCount: 15,
          skills: ['作詞', '企業ソング', 'メッセージ性'],
          description: 'IT企業の創立10周年記念ソングの歌詞を書いていただける方を探しています。未来志向で...',
          createdAt: '2025-04-03T11:00:00Z'
        },
        {
          id: '5',
          title: 'ポッドキャスト用ジングル制作',
          category: 'composition',
          status: 'open',
          client: {
            id: '5',
            name: 'ポッドキャスター山田',
            rating: 5.0,
            completedProjects: 3
          },
          budget: { min: 20000, max: 40000 },
          deadline: '2025-04-25',
          proposalsCount: 20,
          skills: ['ジングル', 'ポッドキャスト', '短尺'],
          description: 'ビジネス系ポッドキャストのオープニングジングル（15秒）を制作してください。プロフェッショナルで...',
          createdAt: '2025-04-01T15:00:00Z'
        },
        {
          id: '6',
          title: 'ボーカロイド楽曲のミキシング',
          category: 'mixing',
          status: 'open',
          client: {
            id: '6',
            name: 'ボカロP たなか',
            rating: 4.7,
            completedProjects: 15
          },
          budget: { min: 25000, max: 45000 },
          deadline: '2025-05-05',
          proposalsCount: 7,
          skills: ['ミキシング', 'ボーカロイド', 'エレクトロニカ'],
          description: 'ボーカロイド楽曲（3分30秒）のミキシングをお願いします。現代的でクリアなサウンドに...',
          createdAt: '2025-04-02T09:00:00Z'
        }
      ]
      setProjects(mockProjects)
      setLoading(false)
    }, 1000)
  }

  // フィルタリングとソート
  const filteredAndSortedProjects = projects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory
      const matchesBudgetMin = !budgetMin || project.budget.max >= parseInt(budgetMin)
      const matchesBudgetMax = !budgetMax || project.budget.min <= parseInt(budgetMax)
      
      return matchesSearch && matchesCategory && matchesBudgetMin && matchesBudgetMax
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        case 'budget':
          return b.budget.max - a.budget.max
        case 'proposals':
          return a.proposalsCount - b.proposalsCount  // 提案が少ない順
        default:
          return 0
      }
    })

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
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return '期限切れ'
    if (diffDays === 0) return '本日まで'
    if (diffDays === 1) return '明日まで'
    if (diffDays <= 7) return `${diffDays}日後`
    
    return date.toLocaleDateString('ja-JP', {
      month: 'numeric',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6232] mx-auto"></div>
          <p className="mt-4 text-gray-600">案件を検索中...</p>
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
                <Link href="/search" className="text-[#ff6232] font-medium">
                  案件を探す
                </Link>
                <Link href="/dashboard/creator" className="text-gray-700 hover:text-[#ff6232]">
                  ダッシュボード
                </Link>
                <Link href="/messages" className="text-gray-700 hover:text-[#ff6232]">
                  メッセージ
                </Link>
                <Link href="/portfolio" className="text-gray-700 hover:text-[#ff6232]">
                  ポートフォリオ
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ページタイトル */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">案件を探す</h1>
          <p className="mt-2 text-gray-600">あなたのスキルに合った案件を見つけましょう</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* 左側：フィルター */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">フィルター</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden text-gray-500"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showFilters ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                  </svg>
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* キーワード検索 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    キーワード
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="案件を検索..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232] focus:border-transparent"
                  />
                </div>

                {/* カテゴリー */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    カテゴリー
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232] focus:border-transparent"
                  >
                    <option value="all">すべて</option>
                    <option value="composition">作曲</option>
                    <option value="arrangement">アレンジ</option>
                    <option value="lyrics">作詞</option>
                    <option value="mixing">ミキシング</option>
                    <option value="mastering">マスタリング</option>
                    <option value="recording">レコーディング</option>
                  </select>
                </div>

                {/* 予算範囲 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    予算範囲
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value)}
                      placeholder="最小"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232] focus:border-transparent"
                    />
                    <span className="text-gray-500">〜</span>
                    <input
                      type="number"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                      placeholder="最大"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* ソート */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    並び替え
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232] focus:border-transparent"
                  >
                    <option value="newest">新着順</option>
                    <option value="deadline">締切が近い順</option>
                    <option value="budget">予算が高い順</option>
                    <option value="proposals">競争率が低い順</option>
                  </select>
                </div>

                {/* フィルターリセット */}
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                    setBudgetMin('')
                    setBudgetMax('')
                    setSortBy('newest')
                  }}
                  className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  フィルターをリセット
                </button>
              </div>
            </div>
          </div>

          {/* 右側：案件リスト */}
          <div className="lg:w-3/4">
            {/* 検索結果数 */}
            <div className="mb-4 text-sm text-gray-600">
              {filteredAndSortedProjects.length}件の案件が見つかりました
            </div>

            {/* 案件カード */}
            <div className="space-y-4">
              {filteredAndSortedProjects.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                  <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500">条件に合う案件が見つかりませんでした</p>
                  <p className="text-sm text-gray-400 mt-2">検索条件を変更してみてください</p>
                </div>
              ) : (
                filteredAndSortedProjects.map((project) => (
                  <div key={project.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-6">
                      {/* タイトルとステータス */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <Link
                            href={`/projects/${project.id}`}
                            className="text-lg font-semibold text-gray-900 hover:text-[#ff6232] transition-colors"
                          >
                            {project.title}
                          </Link>
                          <div className="flex items-center mt-2 space-x-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              募集中
                            </span>
                            <span className="text-sm text-gray-500">
                              {getCategoryLabel(project.category)}
                            </span>
                          </div>
                        </div>
                        <button className="ml-4 p-2 text-gray-400 hover:text-[#ff6232] transition-colors">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>

                      {/* 説明文 */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>

                      {/* スキルタグ */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* 詳細情報 */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">予算</p>
                          <p className="text-sm font-semibold text-gray-900">
                            ¥{project.budget.min.toLocaleString()} - ¥{project.budget.max.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">納期</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatDate(project.deadline)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">提案数</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {project.proposalsCount}件
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">競争率</p>
                          <p className="text-sm font-semibold">
                            {project.proposalsCount < 5 && <span className="text-green-600">低</span>}
                            {project.proposalsCount >= 5 && project.proposalsCount < 10 && <span className="text-yellow-600">中</span>}
                            {project.proposalsCount >= 10 && <span className="text-red-600">高</span>}
                          </p>
                        </div>
                      </div>

                      {/* クライアント情報 */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{project.client.name}</p>
                            <div className="flex items-center text-xs text-gray-500">
                              <svg className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {project.client.rating} • {project.client.completedProjects}件完了
                            </div>
                          </div>
                        </div>
                        <Link
                          href={`/projects/${project.id}/proposal`}
                          className="px-4 py-2 bg-[#ff6232] text-white text-sm font-medium rounded-lg hover:bg-[#ff8a5b] transition-colors"
                        >
                          提案する
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* ページネーション */}
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
      </div>
    </div>
  )
}